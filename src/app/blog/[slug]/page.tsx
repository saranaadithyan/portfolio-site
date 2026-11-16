import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { site } from "@/data/site";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

export const dynamicParams = false;

type TableOfContentsItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

function getTableOfContents(markdown: string): TableOfContentsItem[] {
  const usedIds = new Map<string, number>();

  return Array.from(markdown.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)).map((match) => {
    const level = match[1].length as 2 | 3;
    const label = match[2].replace(/[`*_~]/g, "").trim();
    const baseId = label
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-");
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);

    return { id: count ? `${baseId}-${count}` : baseId, label, level };
  });
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const tableOfContents = getTableOfContents(post.content);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      image: new URL(post.coverImage, site.url).toString(),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: { "@type": "Person", name: site.name, url: site.url },
      mainEntityOfPage: `${site.url}/blog/${post.slug}`,
      keywords: post.tags.join(", "),
      publisher: { "@type": "Person", name: site.name, url: site.url },
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1 py-12 sm:py-16">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C7D80] transition-colors duration-300 hover:text-[#333333]"
          >
            &larr; All posts
          </Link>
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] lg:items-start lg:gap-16">
            <article className="min-w-0 max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-widest text-[#7C7D80]">
                {post.category} · {post.readingTime}
              </p>
              <h1 className="mt-2 break-words text-3xl font-semibold text-[#282929] sm:text-4xl">{post.title}</h1>
              <time dateTime={post.publishedAt} className="mt-2 block text-sm text-[#7C7D80]">
                {formatDate(post.publishedAt)}
              </time>
              <Markdown>{post.content}</Markdown>
            </article>

            {post.mdStudioURL || tableOfContents.length > 0 ? (
              <aside className="min-w-0 w-full max-w-md lg:sticky lg:top-24 lg:max-w-none">
                {post.mdStudioURL ? (
                  <ButtonLink
                    href={post.mdStudioURL}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    View in MD Studio <span aria-hidden="true">↗</span>
                  </ButtonLink>
                ) : null}
                {tableOfContents.length > 0 ? (
                  <nav aria-label="Table of contents" className="mt-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#7C7D80]">
                      On this page
                    </p>
                    <div className="max-h-[min(50vh,32rem)] overflow-y-auto pr-3">
                      <ol className="space-y-2 border-l border-[#27272A]/20 text-sm">
                        {tableOfContents.map((item) => (
                          <li key={item.id} className={item.level === 3 ? "pl-6" : "pl-4"}>
                            <a
                              href={`#${item.id}`}
                              className="block break-words text-[#7C7D80] transition-colors hover:text-[#282929]"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </nav>
                ) : null}
              </aside>
            ) : null}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
