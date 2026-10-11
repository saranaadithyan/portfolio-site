---
title: "How ClickHouse works under the hood"
summary: "We insert 25,000 orders. Then we find one. Let's trace every step ClickHouse takes  from bytes on disk to query result."
category: "Database - Deep Dive"
publishedAt: 2026-10-10
tags: ["Database", "Analytics", "OLAP"]
coverImage: "/database_cover.png"
---


![Cover Image](/database_cover.png)


## 1. A database that thinks in columns, not rows

Database like PostgreSQL, MySQL store data row by row. You insert a customer record with columns (order_id,order_status,timestamp) and everything about that customer lives together on disk. ClickHouse flips this: each column is stored separately. All order IDs together. All statuses together. All timestamps together.

This sounds like a small detail. It isn't. It changes everything about how fast queries run especially analytical queries that touch millions or billions of rows.

**Row-oriented (PostgreSQL)**

```
-- Data on disk:
[1, pending,   2024-01-01 09:00]
[2, shipped,   2024-01-01 09:05]
[3, delivered, 2024-01-01 09:10]
```

**Column-oriented (ClickHouse)**

```
-- Data on disk:
order_id:   [1, 2, 3 ...]
status:     [pending, shipped ...]
created_at: [09:00, 09:05 ...]
```

## 2. What happens when you INSERT

Let's trace exactly what ClickHouse does when you run this:

```sql
CREATE TABLE orders (
    order_id   UInt64,
    status     String,
    created_at DateTime
) ENGINE = MergeTree()
ORDER BY (order_id);

INSERT INTO orders VALUES
(1,  'pending',   '2026-01-01 09:00:00'),
(2,  'shipped',   '2026-01-01 09:05:00'),
...
(25000, 'delivered', '2026-01-03 18:00:00');
```

### Step 1: Flip rows into columns

First thing ClickHouse does  it separates your row data into individual column arrays in memory.

```
order_id.bin    → [1, 2, 3, 4 ... 25000]   → Delta + LZ4  → ~45 KB
status.bin      → [pending, shipped ...]    → LZ4          → ~38 KB
created_at.bin  → [09:00, 09:05 ...]        → DoubleDelta  → ~12 KB
```

### Step 2:  Sort by primary key

All 25,000 rows are sorted by the ***order_id*** (i.e primary key) in memory before anything touches disk. This makes range queries and future merges fast.

```
-- Before sort (insertion order):
order_id: [5, 1, 8, 3, 2, 9, 4, 7, 6 ...]

-- After sort (by primary key):
order_id: [1, 2, 3, 4, 5, 6, 7, 8, 9 ... 25000] 
status:   [reordered to match]
created_at:[reordered to match]
```

Sort happens in memory. Large inserts use more RAM temporarily. This is why ClickHouse recommends inserting in batches of 1,000–100,000 rows, not one row at a time.

### Step 3:  Compress each column

Each column gets the compression algorithm best suited to its column's data type.

```
── order_id column ──────────────────────────
Raw:    [1, 2, 3, 4, 5 ... 25000]
Delta:  [1, 1, 1, 1, 1 ...]        ← differences = all 1s!
LZ4:    [1, repeat(1, 24999)]      ← tiny!

── created_at column ────────────────────────
Raw:    [09:00, 09:05, 09:10 ...]  ← 300s apart
Delta:  [300, 0, 0, 0 ...]         ← evenly spaced = near zero
LZ4:    [300, repeat(0, N)]        ← near zero = tiny!

── status column ─────────────────────────────
Raw:    [pending, shipped, delivered ...]
LZ4:    finds repeated strings → compresses well
```

### Step 4:  Written as an immutable part

Everything lands on disk as a single folder  a **part**. It is never modified. Only replaced by a merge.

```
/var/lib/clickhouse/data/mydb/orders/
└── 20240101_1_1_0/            ← your part
    ├── order_id.bin           ← ~45 KB  compressed column data
    ├── order_id.mrk3          ← ~120 B  byte offsets per granule
    ├── status.bin             ← ~38 KB
    ├── status.mrk3            ← ~120 B
    ├── created_at.bin         ← ~12 KB
    ├── created_at.mrk3        ← ~120 B
    └── primary.idx            ← ~16 B   sparse index (4 entries for 25k rows)
```

## 3.  Granules & The Sparse Index

### How ClickHouse organises 25,000 rows

ClickHouse never reads one row at a time from disk. It reads in chunks of **8,192 rows** called **granules**. Your 25,000 rows produce exactly 4 granules.

```
Part: 20240101_1_1_0  (25,000 rows, sorted by order_id)
│
├── Granule 0 → rows 1      to 8,192    (order_id 1     → 8192)
├── Granule 1 → rows 8,193  to 16,384   (order_id 8193  → 16384)
├── Granule 2 → rows 16,385 to 24,576   (order_id 16385 → 24576)
└── Granule 3 → rows 24,577 to 25,000   (order_id 24577 → 25000)
```

### What gets stored for each granule

Three files work together:

```
primary.idx           order_id.mrk3          order_id.bin
(index file)          (mark file)            (actual data)

Granule 0 → 1    ──→  offset: 0      ──→   [1...8192]     compressed
Granule 1 → 8193  →   offset: 4821   ──→   [8193...16384] compressed
Granule 2 → 16385 →   offset: 9302   ──→   [16385...24576]compressed
Granule 3 → 24577 →   offset: 13100  ──→   [24577...25000]compressed
```

1. **primary.idx** → stores the first ***order_id*** of each granule
2. **mrk3 file** → stores the exact byte position in the ***.bin*** file
3. **bin file** → stores the actual compressed column data

### The Sparse Index (primary.idx)

Instead of indexing every row (like a B-tree), ClickHouse stores just **one index entry per granule**. For 25,000 rows that's 4 tiny entries that fit entirely in RAM.

```
primary.idx  only 4 entries for 25,000 rows:

Granule 0  →  first order_id = 1        ← index entry
Granule 1  →  first order_id = 8193     ← index entry
Granule 2  →  first order_id = 16385    ← index entry
Granule 3  →  first order_id = 24577    ← index entry

-- For 1 billion rows: ~122,000 entries  still fits in RAM!
```

## 4  Finding order_id = 17,200

### The query trace, step by step

```sql
SELECT * FROM orders WHERE order_id = 17200;
```

**Step 1** => (0.001ms)  Read ***primary.idx*** into RAM (4 entries, tiny)

**Step 2** => (0.002ms)  Binary search: is 17200 ≥ 1? Yes. Is 17200 ≥ 8193? Yes. Is 17200 ≥ 16385? Yes. Is 17200 ≥ 24577? No.

**Step 3** => (0.003ms)  Granule 0 (order_id 1–8192): 17200 out of range → **SKIP**

**Step 4** => (0.003ms)  Granule 1 (order_id 8193–16384): 17200 out of range → **SKIP**

**Step 5** => (0.004ms)  Granule 2 (order_id 16385–24576): 17200 in range → **READ**

**Step 6** => (0.005ms)  Granule 3 (order_id 24577–25000): 17200 out of range → **SKIP**

**Step 7** => (0.008ms)  Read mrk3: Granule 2 starts at byte offset 9302 in ***order_id.bin***

**Step 8** => (0.012ms)  Decompress & scan 8,192 rows from Granule 2 → found ***order_id = 17200***


### Why only Granule 2?

| Granule | Range | 17200 in range? |
|---|---|---|
| Granule 0 | order_id 1 → 8192 | 17200 > 8192 ✗ SKIP |
| Granule 1 | order_id 8193 → 16384 | 17200 > 16384 ✗ SKIP |
| **Granule 2** | **order_id 16385 → 24576** | **16385 ≤ 17200 ≤ 24576 ✓ READ** |
| Granule 3 | order_id 24577 → 25000 | 17200 < 24577 ✗ SKIP |


ClickHouse reads **8,192 rows** out of 25,000 to find order_id 17200. That's 67% less disk I/O than a full scan. At a billion rows, this difference is enormous.


## 5  Background Merges

### How parts stay manageable over time

Every INSERT creates a new part. After a day of inserts, you might have hundreds of parts. ClickHouse merges them in the background  keeping the number of parts small and queries fast.

```
After 4 insert batches, disk has 4 parts at level 0:

20240101_1_1_0   (rows 1–1000)
20240101_2_2_0   (rows 1001–2000)
20240101_3_3_0   (rows 2001–3000)
20240101_4_4_0   (rows 3001–4000)

    ↓  Background merge (k-way sorted merge, min-heap algorithm)

20240101_1_4_1   (rows 1–4000, sorted · level 1)

✓ Old parts deleted. One clean merged part remains.
```

### Part naming tells the story

```
20240101_1_4_1
    │       │ │ │
    │       │ │ └── merge level (1 = merged once)
    │       │ └──── max block number (batch 4)
    │       └────── min block number (batch 1)
    └────────────── partition (date)
```

### What else happens during a merge

| Engine | Extra work during merge |
|---|---|
| MergeTree | Combines and re-sorts parts. Nothing extra. |
| ReplacingMergeTree | Deduplicates  keeps only the latest row per primary key. Used to simulate UPDATE. |
| AggregatingMergeTree | Pre-aggregates rows with the same key. Used for fast dashboards. |
| TTL Merge | Deletes rows older than the TTL expression. Data expires automatically. |

**Too many parts?** 

ClickHouse slows inserts at 150 parts and blocks them entirely at 300. Always batch your inserts  minimum 1,000 rows per INSERT call.

## Summary  Everything That Happened

### 1. INSERT 25,000 rows

ClickHouse splits rows into columns, sorts by ***order_id*** in memory, compresses each column (Delta+LZ4 for order_id, DoubleDelta for timestamps), then writes an immutable part folder to disk.

### 2. 4 granules created

25,000 rows ÷ 8,192 = 4 granules. The sparse index ***(primary.idx)*** records the first ***order_id*** of each granule  just 4 entries that live in RAM forever.

### 3. SELECT order_id = 17200

Binary search the sparse index in RAM → narrow to Granule 2. Use ***.mrk3*** file to jump to the exact byte offset. Read only 8,192 rows. Skip the other 16,808.

### 4. Background merge

Multiple insert parts are merged into one sorted part by a background thread. Old parts are atomically swapped out. Queries never see inconsistent data. Parts grow through levels: 0 → 1 → 2 → ...

## Quick Reference

| Concept | Simple meaning |
|---|---|
| **Part** | A folder on disk for one batch of inserts |
| **Immutable** | Parts are never edited, only merged |
| **Sorted** | Rows always sorted by primary key inside a part |
| **Granule** | A chunk of 8,192 rows  the smallest thing ClickHouse reads |
| **primary.idx** | Stores first key of each granule  stays in RAM |
| **mrk3 file** | Maps granule → exact byte on disk |
| **Granule skip** | Query only reads granules that *might* have the answer |
| **Merge** | Background job combining small parts into one big sorted part |
| **Merge level** | How many times a part has been merged (0 = fresh insert) |


## Conclusion
 
ClickHouse isn't magic — it's a collection of very deliberate engineering decisions, each one compounding the previous.
 
Storing columns separately means a query that needs 3 fields out of 100 reads 3% of the data. Sorting rows by primary key at insert time means ranges can be skipped without scanning. Grouping 8,192 rows into a granule and recording just the first key of each means the entire index for a billion-row table fits in a few megabytes of RAM. Writing data as immutable parts and merging them in the background means inserts are never blocked by reads, and reads are never blocked by merges.
 
Put it all together and you get what we traced through this entire post:
 
1. **25,000 rows inserted** → split into columns, sorted, compressed column by column, written as one immutable part in milliseconds
2. **4 granules** → the sparse index is just 4 entries, permanently in RAM
3. **One query for order_id = 17,200** → 3 granules skipped, 1 granule read, answer returned after touching 8,192 rows out of 25,000
4. **Background merge** → parts quietly combine overnight, leaving one clean sorted part, zero downtime