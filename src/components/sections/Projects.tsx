import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/data/projects";

const statusColors: Record<string, string> = {
  Live: "text-[#333333]",
  "In Progress": "text-[#7C7D80]",
  Archived: "text-[#7C7D80]",
};

export function Projects() {
  return (
    <Section id="projects">
      <Heading eyebrow="Portfolio">Projects</Heading>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.slug} className="reveal flex flex-col">
            <div className="-mx-6 -mt-6 aspect-video overflow-hidden rounded-t-xl border-b border-[#27272A]/15 bg-white">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={225}
                className="h-full w-full object-contain"
              />
            </div>

            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[#282929]">{project.title}</h3>
                <span className={`text-xs font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-sm text-[#444444]">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
              {/* <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#7C7D80]">
                    #{tag}
                  </span>
                ))}
              </div> */}
            </CardContent>

            <CardFooter>
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#333333] hover:text-[#282929]"
                >
                  GitHub
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#333333] hover:text-[#282929]"
                >
                  Live Demo
                </a>
              ) : null}
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
