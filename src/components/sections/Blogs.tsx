import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { blogPosts } from "@/data/blogs";

export function Blogs() {
  return (
    <Section id="blogs">
      <Heading eyebrow="Writing">Blogs</Heading>

      {blogPosts.length === 0 ? (
        <div className="reveal mt-10 rounded-xl border border-dashed border-[#27272A]/20 bg-[#F8F8F8] p-12 text-center">
          <p className="text-base text-[#444444]">
            New posts are on the way. Check back soon for articles on engineering and product
            work.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="reveal flex flex-col">
              <div className="-mx-6 -mt-6 aspect-video overflow-hidden rounded-t-xl border-b border-[#27272A]/15 bg-white">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={400}
                  height={225}
                  className="h-full w-full object-contain"
                />
              </div>
              <CardHeader>
                <p className="text-xs font-medium uppercase tracking-widest text-[#7C7D80]">
                  {post.category} · {post.readingTime}
                </p>
                <h3 className="text-lg font-semibold text-[#282929]">{post.title}</h3>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-[#444444]">{post.summary}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#333333] hover:text-[#282929] hover:underline"
                >
                  Read More
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
