import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { getAllPosts, formatDate } from "@/lib/blog";

export function Blogs() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <Section id="blogs">
      <div className="flex items-center justify-between gap-4">
        <Heading eyebrow="Writing">Blogs</Heading>
        {posts.length > 0 ? (
          <Link
            href="/blog"
            className="shrink-0 whitespace-nowrap text-sm font-medium text-[#333333] hover:text-[#282929] hover:underline"
          >
            View all posts &rarr;
          </Link>
        ) : null}
      </div>

      {posts.length === 0 ? (
        <div className="reveal mt-10 rounded-xl border border-dashed border-[#27272A]/20 bg-[#F8F8F8] p-12 text-center">
          <p className="text-base text-[#444444]">
            New posts are on the way. Check back soon for articles on engineering and product
            work.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Section>
  );
}

export function PostCard({ post }: { post: ReturnType<typeof getAllPosts>[number] }) {
  return (
    <Card className="reveal flex flex-col">
      <div className="-mx-6 -mt-6 aspect-video overflow-hidden rounded-t-xl border-b border-[#27272A]/15 bg-white">
        <Image
          src={post.coverImage}
          alt={post.title}
          width={400}
          height={225}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-widest text-[#7C7D80]">
          {post.category} · {post.readingTime}
        </p>
        <h3 className="text-lg font-semibold text-[#282929]">{post.title}</h3>
        <time dateTime={post.publishedAt} className="text-xs text-[#7C7D80]">
          {formatDate(post.publishedAt)}
        </time>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-[#444444]">{post.summary}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-medium text-[#333333] hover:text-[#282929] hover:underline"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
}
