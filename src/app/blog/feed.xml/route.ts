import { site } from "@/data/site";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${site.url}/blog/${p.slug}</link>
<guid>${site.url}/blog/${p.slug}</guid>
<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
<description>${esc(p.summary)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.name)} — Blog</title>
<link>${site.url}/blog</link>
<description>${esc(site.description)}</description>
${items}
</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
