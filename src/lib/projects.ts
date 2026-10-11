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

export const projects: Project[] = [
  {

    order:1,
    slug: "project-one",
    title: "Offline Product Pricing App",
    summary:
      "A cross-platform mobile application developed with Flutter for offline product catalog management and dynamic price calculation.",
    images: [{
      src: "/placeholder-project.png",
      alt: ""
    }],
    technologies: ["Flutter", "Dart"],
    githubUrl: "",
    liveUrl: "",
    status: "Live",
    tags: ["Mobile App"],
  },
  {
    order:2,
    slug: "project-two",
    title: "Attendance Management App",
    summary:
      "An offline-first attendance management system built with React Native, designed for admin-controlled employee tracking with comprehensive reporting features.",
    images: [{
      src: "/placeholder-project.png",
      alt: ""
    }],
    technologies: ["React", "React Native", "Offline", "Native Modules (Android)"],
    githubUrl: "",
    status: "Live",
    tags: ["Mobile App"],
  },
  {
    order:3,
    slug: "project-three",
    title: "Inventory Management App",
    summary:
      "An inventory management system built with React Native, featuring real-time tracking, stock management, and reporting capabilities.",
    images: [{
      src: "/placeholder-project.png",
      alt: ""
    }],
    technologies: ["React", "React Native", "Offline", "Native Modules (Android)"],
    githubUrl: "",
    liveUrl: "",
    status: "Live",
    tags: ["Mobile App"],
  },

];

export function getAllProjects(): Project[] {
  // if (!fs.existsSync(PROJECTS_DIR)) return [];
  return projects
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



// export function getAllProjects(): Project[] {
//   if (!fs.existsSync(PROJECTS_DIR)) return [];
//   return fs
//     .readdirSync(PROJECTS_DIR)
//     .filter((f) => f.endsWith(".md"))
//     .map(readProject)
//     .filter((p): p is NonNullable<typeof p> => p !== null)
//     .map((p) => ({
//       slug: p.slug,
//       title: p.title,
//       summary: p.summary,
//       status: p.status,
//       technologies: p.technologies,
//       tags: p.tags,
//       githubUrl: p.githubUrl,
//       liveUrl: p.liveUrl,
//       order: p.order,
//       images: p.images,
//     }))
//     .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
// }

// export function getProjectBySlug(slug: string) {
//   if (!/^[a-z0-9-]+$/i.test(slug)) return null;
//   const file = `${slug}.md`;
//   if (!fs.existsSync(path.join(PROJECTS_DIR, file))) return null;
//   return readProject(file);
// }

