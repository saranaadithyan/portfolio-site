import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project } from "@/data/projects";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const STATUSES: Project["status"][] = ["Live", "In Progress", "Archived"];

function readProject(file: string): (Project & { content: string }) | null {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8"));

  const images = Array.isArray(data.images) ? data.images.slice(0, 3) : [];
  if (!data.title || images.length === 0) return null;

  return {
    slug,
    title: data.title,
    summary: data.summary ?? "",
    status: STATUSES.includes(data.status) ? data.status : "Live",
    technologies: data.technologies ?? [],
    tags: data.tags ?? [],
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    order: typeof data.order === "number" ? data.order : 999,
    images,
    content,
  };
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readProject)
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      status: p.status,
      technologies: p.technologies,
      tags: p.tags,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      order: p.order,
      images: p.images,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getProjectBySlug(slug: string) {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(PROJECTS_DIR, file))) return null;
  return readProject(file);
}
