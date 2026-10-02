import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollRevealInit } from "@/components/layout/ScrollRevealInit";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PostCard } from "@/components/sections/Blogs";
import { site } from "@/data/site";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on engineering, cloud and web development.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} — Blog`,
    url: `${site.url}/blog`,
    author: { "@type": "Person", name: site.name, url: site.url },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${site.url}/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <ScrollRevealInit />
      <main className="flex-1 py-12 sm:py-16">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C7D80] transition-colors duration-300 hover:text-[#333333]"
          >
            &larr; Back
          </Link>
          <div className="mt-6">
            <Heading as="h1" eyebrow="Writing">Blog</Heading>
          </div>
          {posts.length === 0 ? (
            <p className="mt-10 text-base text-[#444444]">No posts yet. Check back soon.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
