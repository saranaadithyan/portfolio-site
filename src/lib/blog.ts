import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost } from "@/data/blogs";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function readPost(file: string): (BlogPost & { content: string; draft: boolean }) | null {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.publishedAt) return null;

  // gray-matter/YAML parses bare dates into Date objects
  const toIso = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v));
  const words = content.trim().split(/\s+/).length;

  return {
    slug,
    title: data.title,
    summary: data.summary ?? "",
    coverImage: data.coverImage ?? "/placeholder-certificate.svg",
    category: data.category ?? "General",
    publishedAt: toIso(data.publishedAt),
    updatedAt: data.updatedAt ? toIso(data.updatedAt) : undefined,
    tags: data.tags ?? [],
    readingTime: `${Math.max(1, Math.round(words / 200))} min read`,
    draft: Boolean(data.draft),
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPost)
    .filter((p): p is NonNullable<typeof p> => p !== null && !p.draft)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      coverImage: p.coverImage,
      category: p.category,
      publishedAt: p.publishedAt,
      updatedAt: p.updatedAt,
      tags: p.tags,
      readingTime: p.readingTime,
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string) {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  const post = readPost(file);
  return post && !post.draft ? post : null;
}
