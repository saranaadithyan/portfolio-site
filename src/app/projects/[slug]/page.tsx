import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { site } from "@/data/site";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
    },
    twitter: { card: "summary_large_image", title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${site.url}/#projects` },
        {
          "@type": "ListItem",
          position: 3,
          name: project.title,
          item: `${site.url}/projects/${project.slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: project.title,
      description: project.summary,
      url: `${site.url}/projects/${project.slug}`,
      ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
      programmingLanguage: project.technologies,
      author: { "@type": "Person", name: site.name, url: site.url },
      image: project.images.map((img) => new URL(img.src, site.url).toString()),
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1 py-12 sm:py-16">
        <Container>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C7D80] transition-colors duration-300 hover:text-[#333333]"
          >
            &larr; All projects
          </Link>

          <article className="mt-6 max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#7C7D80]">
              {project.status}
              {project.tags.length ? ` · ${project.tags.join(", ")}` : ""}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#282929] sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 text-base text-[#444444] sm:text-lg">{project.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>

            {project.githubUrl || project.liveUrl ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <ButtonLink href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live Demo
                  </ButtonLink>
                ) : null}
                {project.githubUrl ? (
                  <ButtonLink
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                  >
                    GitHub
                  </ButtonLink>
                ) : null}
              </div>
            ) : null}
          </article>

          <div
            className={`mt-10 grid gap-4 ${
              project.images.length > 1 ? "sm:grid-cols-2" : ""
            } ${project.images.length === 3 ? "lg:grid-cols-3" : ""}`}
          >
            {project.images.map((img, i) => (
              <div
                key={img.src}
                className="aspect-video overflow-hidden rounded-xl border border-[#27272A]/15 bg-white"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={450}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={i === 0}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <Markdown>{project.content}</Markdown>
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
