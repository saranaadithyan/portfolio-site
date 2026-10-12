---
title: "PostgreSQL Internals"
summary: "Inserting 25,000 Records"
category: "Database - Deep Dive"
publishedAt: 2026-10-11
tags: ["Database", "Transaction","Index", "OLTP"]
coverImage: "/database_cover.png"
---


![Cover Image](/database_cover.png)

This post continues directly from [**ClickHouse Internals: How It Really Works**](/blog/How-ClickHouse-works-under-the-hood). In that post, we inserted 25,000 orders into ClickHouse and traced every step: column splits, Delta compression, granules, sparse indexes, and background merges. We found ***order_id = 17200*** by reading just 8,192 rows out of 25,000.
 
Now we insert the **exact same 25,000 rows into PostgreSQL** and trace what happens differently. Same table. Same data. Completely different internals.

**Topics covered:** Heap storage · WAL / write-ahead log · MVCC tuples · B-tree index · Sequential scan vs index scan

## Quick Recap: What ClickHouse Did

Before diving into Postgres, here's what ClickHouse did with the same 25,000 rows so the contrast is sharp in your mind:

```
ClickHouse INSERT path:
  1. Split rows into separate column arrays in memory
  2. Sort all rows by order_id
  3. Compress each column independently (Delta+LZ4, DoubleDelta+LZ4)
  4. Write one immutable part folder to disk
  5. Build a sparse index: just 4 entries for 25,000 rows
  6. Background merge combines parts over time

ClickHouse SELECT order_id = 17200:
  → Read 4-entry sparse index from RAM
  → Skip granules 0, 1, 3
  → Read only granule 2 (8,192 rows)
  → Found. 67% of data never touched.
```

Postgres takes a fundamentally different approach to all of this. Let's trace it step by step.


## The Same Table, Different Engine

```sql
-- ClickHouse version (from Part 1):
CREATE TABLE orders (
    order_id   UInt64,
    status     String,
    created_at DateTime('UTC')
) ENGINE = MergeTree()
ORDER BY (order_id);

-- PostgreSQL version (this post):
CREATE TABLE orders (
    order_id   BIGINT,
    status     VARCHAR(20),
    created_at TIMESTAMPTZ
);
```

The columns map directly: ***UInt64*** to ***BIGINT***, ***String*** to ***VARCHAR(20)***, ***DateTime*** to ***TIMESTAMPTZ***.  
But the storage engine underneath is nothing alike. ClickHouse writes column files. Postgres writes heap pages.


## 1. Heap Storage

### Postgres stores rows in 8 KB pages

Unlike ClickHouse which splits each column into a separate ***.bin*** file, Postgres keeps every column of a row ***together on the same page***. The heap is a flat sequence of 8 KB pages on disk all rows poured in, in insertion order, with no sorting.

```sql
-- Postgres stores the table physically as:
-- /var/lib/postgresql/data/base/16384/orders_heap
-- A single flat file of 8 KB pages, one after another

INSERT INTO orders VALUES
(1,  'pending',   '2024-01-01 09:00:00+00'),
(2,  'shipped',   '2024-01-01 09:05:00+00'),
...
(25000, 'delivered', '2024-01-03 18:00:00+00');
```

### How many pages does 25,000 rows take?

Each order row costs roughly 68 bytes i.e., 8B for ***order_id***, ~9B for ***status***, 8B for ***created_at*** plus some additional ~18B of MVCC overhead headers and ~4B alignment padding. Each 8 KB page holds about 110 rows.

```
row size     ≈ 68 bytes (data + MVCC headers + alignment)
page size    = 8,192 bytes
rows/page    ≈ 110  (after 24B page header + item pointer array)
pages needed = 25,000 ÷ 110 ≈ 228 pages  (~1.8 MB on disk)

Compare to ClickHouse:
  order_id.bin   → ~45 KB  (Delta + LZ4 compressed)
  status.bin     → ~38 KB
  created_at.bin → ~12 KB
  Total          → ~95 KB  (19× smaller for the same data)
```

### Inside a single 8 KB page

Item pointers grow downward from the top. Tuples fill upward from the bottom. Free space sits in between and shrinks as rows are added. When the two meet, the page is full.

```
┌────────────────────────────────────────────┐
│ Page Header (24 bytes)                     │  LSN, checksum, free space pointers
│ Item Pointer 1  → offset 7820              │  4 bytes → points to Tuple 1 below
│ Item Pointer 2  → offset 7748              │  grows ↓
│ ...                                        │
│                                            │
│              (free space)                  │  ← shrinks with every insert
│                                            │
│ Tuple 110 (order_id=110, 'pending', ...)   │  grows ↑
│ Tuple 2   (order_id=2,   'shipped', ...)   │
│ Tuple 1   (order_id=1,   'pending', ...)   │
└────────────────────────────────────────────┘
```

**Key difference from ClickHouse:** rows are stored in **insertion order with no sorting**. ***order_id=17200*** could land on any of the 228 pages; Postgres has no guarantee. ClickHouse sorts every part by ***order_id*** before writing, so it always knows which granule a value lives in.


## 2. Write-Ahead Log (WAL)

### Before touching the heap, Postgres writes the WAL

ClickHouse writes an immutable part to disk and returns. Postgres has a more careful two-phase process: write the WAL first, then write the heap. The WAL is the durability guarantee, a sequential append-only log that Postgres replays after a crash.

**WAL must flush before the INSERT returns.** Postgres won't acknowledge "inserted" to your application until the WAL record is safely on disk. The heap page can stay in RAM and be written later. If the server crashes before the heap write, the WAL is replayed to reconstruct it.

```
-- For each row, Postgres appends a WAL record:

WAL record type:  XLOG_HEAP_INSERT
Transaction ID:   7421          ← your INSERT's XID
Target relation:  orders        ← which table
Block number:     0             ← which 8 KB page
Offset:           1             ← which slot on that page
Tuple data:       [1, 'pending', '2024-01-01 09:00']

-- 25,000 rows = ~25,000 WAL records written sequentially
-- Sequential I/O → fast. No random seeks.
```

### Full WAL stream for our INSERT

```
LSN               TYPE           DATA
0/1A4B2C00        BEGIN          XID=7421
0/1A4B2C40        HEAP_INSERT    rel=orders blk=0 off=1  (1, pending, 2024-01-01 09:00)
0/1A4B2CA0        HEAP_INSERT    rel=orders blk=0 off=2  (2, shipped, 2024-01-01 09:05)
0/1A4B2D00        HEAP_INSERT    rel=orders blk=0 off=3  (3, delivered, 2024-01-01 09:10)
0/1A4B2D60        BTREE_INSERT   idx=idx_orders blk=42   (key=1     → tid=(0,1))
0/1A4B2DC0        BTREE_INSERT   idx=idx_orders blk=42   (key=2     → tid=(0,2))
0/1A5F0000        HEAP_INSERT    rel=orders blk=156 off=43 (17200, shipped, 2024-01-01 16:40)
0/1A5F0060        BTREE_INSERT   idx=idx_orders blk=89   (key=17200 → tid=(156,43))
0/1B200000        HEAP_INSERT    rel=orders blk=227 off=92 (25000, delivered, 2024-01-03 18:00)
0/1B200100        COMMIT         XID=7421  ts=2024-01-03 18:00:01
```

### WAL write vs heap write

| | WAL write | Heap write |
|---|---|---|
| **Timing** | Must complete before INSERT returns | Deferred: stays in ***shared_buffers*** RAM first |
| **I/O pattern** | Sequential append | Random I/O (one seek per page) |
| **Flushed by** | ***fsync()*** at commit | ***bgwriter*** / ***checkpointer*** background processes |
| **On crash** | Replayed to recover all missing writes | Reconstructed from WAL replay |


## 3. MVCC Tuple Headers

### Every row carries its own visibility passport

ClickHouse has no concept of concurrent transactions: you write parts, you read parts, and merges happen in the background. Postgres handles multiple concurrent readers and writers by embedding **visibility metadata directly inside every row tuple**.

This is MVCC Multi-Version Concurrency Control. Instead of taking locks, Postgres lets each transaction see its own consistent snapshot of the data based on transaction IDs.

```
-- Every heap tuple on every page looks like this:

┌─────────────────────────────────────────────────────┐
│  t_xmin  = 7421   ← XID that created this row       │
│  t_xmax  = 0      ← XID that deleted/updated it     │
│                      0 means the row is still alive  │
│  t_ctid  = (0,1)  ← (page 0, slot 1) self-pointer   │
│  t_infomask = ... ← visibility flags, null bitmap   │
├─────────────────────────────────────────────────────┤
│  order_id   = 1                                     │
│  status     = 'pending'                             │
│  created_at = '2024-01-01 09:00:00+00'              │
└─────────────────────────────────────────────────────┘
```

### Visibility across concurrent transactions

When your INSERT (XID 7421) runs alongside a concurrent reader (XID 7420):

| order_id | status | t_xmin | t_xmax | Visible to XID 7420? | Visible to XID 7421? |
|---|---|---|---|---|---|
| 1 | pending | 7421 | 0 (alive) | NO | YES |
| 2 | shipped | 7421 | 0 (alive) | NO | YES |
| 3 | delivered | 7421 | 0 (alive) | NO | YES |
| 1 | pending (old version) | 7400 | ~~7421~~ | YES | NO |

XID 7420 started before the INSERT it sees the old world. XID 7421 sees its own freshly inserted rows immediately.

**MVCC is why Postgres has no read locks.** A SELECT and an INSERT can run simultaneously; each sees its own consistent snapshot based on transaction IDs. ClickHouse achieves the same for reads vs merges using an atomic part swap, but it has no concept of concurrent writes to the same rows.

### The cost: table bloat

When you UPDATE a row, Postgres doesn't modify the tuple in place. It marks the old tuple dead and inserts a brand new one. Dead tuples stay on disk until ***VACUUM*** removes them.

```sql
UPDATE orders SET status = 'shipped' WHERE order_id = 1;

-- What Postgres actually does:
-- 1. Mark old tuple dead:  t_xmax = 7422 (current XID)
-- 2. Insert a new tuple:   t_xmin = 7422, status = 'shipped'
-- 3. Old tuple sits on the page until VACUUM cleans it up

-- 25,000 UPDATEs = 25,000 dead tuples + 25,000 new tuples
-- Table size doubles until VACUUM runs.
-- ClickHouse equivalent: full part rewrite, also expensive for a different reason.
```

## 4. B-Tree Index

### The index update that happens on every INSERT

In ClickHouse, the sparse index is written once when the part is created and never touched again. In Postgres, **every single INSERT must update the B-tree index**. It traverses the tree, finds the right leaf page, and inserts ***(order_id to heap TID)***.

```sql
CREATE INDEX idx_orders_order_id ON orders (order_id);

-- For INSERT of order_id=17200, Postgres does all of this:
-- 1. Traverse B-tree root → internal → leaf page
-- 2. Insert entry: (order_id=17200 → heap TID (page 156, slot 43))
-- 3. If leaf page is full → page split (writes two pages, WAL-logs both)
-- 4. WAL-log the index page change
-- 5. Repeat for all 25,000 rows
```

### B-tree structure for 25,000 order_ids

Postgres builds a balanced tree. Each internal node holds ~340 keys. At 25,000 rows the tree is only 3 levels deep.

```
                     ┌──────────────────┐
                     │   Root: 1–25000  │   ← level 0: 1 page
                     └──────────────────┘
                      /        |        \
           ┌──────────┐  ┌──────────┐  ┌───────────┐
           │  1–8500  │  │8501–17000│  │17001–25000│  ← level 1: internal nodes
           └──────────┘  └──────────┘  └───────────┘
                                              |
                   ┌──────────┬──────────┬──────────┐
                   │17001–17340│17341–17680│17681+... │  ← level 2: leaf pages
                   └──────────┴──────────┴──────────┘
                        ↓ heap TID pointer
               order_id=17200 → heap (page 156, slot 43)
```

**Searching for order_id = 17200:**

1. Root node: 17200 in range 1–25000 → descend
2. Internal node: 17200 > 17001 → right branch (17001–25000)
3. Leaf page: 17200 in range 17001–17340 → found
4. Return heap TID ***(page 156, slot 43)*** → fetch heap page 156

### B-tree vs ClickHouse sparse index: side by side

| | Postgres B-tree | ClickHouse sparse index |
|---|---|---|
| **Entries** | One per row → exact row location | One per 8,192 rows → granule location |
| **Index size** | ~550 KB for 25,000 rows | ~16 bytes for 25,000 rows |
| **Updated on INSERT** | Yes every insert touches the tree | No written once, immutable |
| **Page splits** | Yes leaf full → split, random I/O | No immutable sorted parts, no splits |
| **Lookup precision** | Exact page + slot | Granule (up to 8,192 rows to scan) |
| **Updates/deletes** | Natively supported | Expensive full part rewrite |


## 5. SELECT order_id = 17,200

### How Postgres finds the row

In Part 1, ClickHouse found ***order_id = 17200*** by binary searching a 4 entry sparse index, skipping 3 of 4 granules, and reading 8,192 rows. Postgres takes a different path it uses the B-tree to jump to an exact page and slot.

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE order_id = 17200;

Index Scan using idx_orders_order_id on orders
  Index Cond: (order_id = 17200)
  Rows Removed by Filter: 0
  Heap Fetches: 1
  Actual rows: 1
  Actual time: 0.032 ms
```

### SELECT execution trace

| Time | Action | Type |
|---|---|---|
| 0.001ms | Planner checks ***pg_statistic***: index exists, selectivity = 1/25000 → use index scan | PLAN |
| 0.004ms | ShareLock acquired on index: does not block concurrent reads | LOCK |
| 0.006ms | B-tree traversal: Root → internal node (17001–25000) → leaf with order_id=17200 | INDEX |
| 0.009ms | Leaf returns heap TID = (page 156, slot 43) | INDEX |
| 0.012ms | Fetch heap page 156 from ***shared_buffers*** (cache hit) or disk | HEAP |
| 0.018ms | Read slot 43 → MVCC check: t_xmin=7421 (committed), t_xmax=0 (alive) → visible | MVCC |
| 0.032ms | Return ***\(17200, 'shipped', '2024-01-01 16:40:00+00'\)*** to client | DONE |

### What if there's no index? (Sequential scan)

Without the B-tree, Postgres has no shortcut. It reads all 228 pages from start to finish, checking every row.

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE order_id = 17200;
-- (after DROP INDEX idx_orders_order_id)

Seq Scan on orders
  Filter: (order_id = 17200)
  Rows Removed by Filter: 24999    ← every row scanned
  Actual rows: 1
  Actual time: 4.2 ms              ← 130× slower than index scan
```

**Seq scan vs ClickHouse granule skip:**

1. Postgres seq scan: reads **228 pages × 8 KB = 1.8 MB**
1. ClickHouse (no index, just sorted data): reads **1 granule × 8,192 rows ≈ 557 KB** and skips 3 granules because data is sorted by ***order_id***

Even without an explicit index, ClickHouse beats Postgres's full scan because sorting is built into the storage format itself.


## Summary

### The full INSERT journey: Postgres in 5 steps

| Step | What happens | Where |
|---|---|---|
| **WAL write** | One WAL record per row appended to ***pg_wal***. Sequential I/O. ***fsync()*** before INSERT returns. | ***pg_wal/*** on disk |
| **Heap write** | Row written into an 8 KB page in ***shared_buffers*** (RAM). Stored in insertion order. Each row gets ***t_xmin***/***t_xmax*** MVCC headers. | ***shared_buffers*** → heap file |
| **Index update** | ***(order_id → heap TID)*** inserted into B-tree leaf. Page split if leaf is full. Also WAL-logged. | B-tree index file |
| **Background flush** | ***bgwriter*** / ***checkpointer*** flushes dirty ***shared_buffers*** pages to the heap file on disk. | heap file on disk |
| **SELECT** | Planner picks index scan → B-tree traversal (3 pages) → heap TID → fetch 1 heap page → MVCC check → return row. | index + heap |

### Postgres vs ClickHouse: the full comparison

| Aspect | PostgreSQL | ClickHouse |
|---|---|---|
| **Storage model** | Row-oriented: all columns together on 8 KB heap pages | Column-oriented: each column in a separate ***.bin*** file |
| **Insert sort** | No sort: rows land in insertion order | Always sorted by ***ORDER BY*** key before writing |
| **Compression** | None on heap pages by default | Per-column: Delta+LZ4, DoubleDelta+LZ4, ZSTD |
| **Index type** | B-tree: 1 entry per row → exact TID | Sparse: 1 entry per 8,192 rows → granule |
| **Index size** | ~550 KB for 25,000 rows | ~16 bytes for 25,000 rows |
| **Index on INSERT** | Updated on every single insert | Written once at part creation, never updated |
| **Durability** | WAL + ***shared_buffers*** + ***fsync()*** | Immutable parts written directly to disk |
| **Concurrency** | MVCC: per-tuple ***t_xmin***/***t_xmax***, no read locks | No MVCC: atomic part swap for merge safety |
| **Find one row** | Index scan: 3 B-tree pages + 1 heap page | Sparse index + scan 1 granule (8,192 rows) |
| **UPDATE cost** | Mark old tuple dead + insert new tuple | Full part rewrite: very expensive |
| **Disk size** | ~1.8 MB for 25,000 rows (uncompressed heap) | ~95 KB for 25,000 rows (compressed columns) |
| **Best for** | OLTP: frequent reads, writes, updates, transactions | OLAP: bulk inserts, analytical queries, time-series |

---

### The one-line version

Postgres keeps every row whole and tracks every transaction. ClickHouse splits every column apart and never looks back.

Both are correct. They are optimised for different work.

---

*Part 2 of 2: continue to Part 1, [**ClickHouse Internals: How It Really Works**](/blog/How-ClickHouse-works-under-the-hood)*
