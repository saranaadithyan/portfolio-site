export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: "Live" | "In Progress" | "Archived";
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    description:
      "A placeholder project description. Replace with a summary of the problem, your approach, and the outcome.",
    image: "/placeholder-project.svg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/your-username/project-one",
    liveUrl: "https://example.com",
    status: "Live",
    tags: ["Web App"],
  },
  {
    slug: "project-two",
    title: "Project Two",
    description:
      "A placeholder project description. Replace with a summary of the problem, your approach, and the outcome.",
    image: "/placeholder-project.svg",
    technologies: ["React", "Node.js", "Express"],
    githubUrl: "https://github.com/your-username/project-two",
    status: "In Progress",
    tags: ["API"],
  },
  {
    slug: "project-three",
    title: "Project Three",
    description:
      "A placeholder project description. Replace with a summary of the problem, your approach, and the outcome.",
    image: "/placeholder-project.svg",
    technologies: ["Docker", "Oracle Cloud Infrastructure"],
    githubUrl: "https://github.com/your-username/project-three",
    liveUrl: "https://example.com",
    status: "Live",
    tags: ["DevOps"],
  },
  {
    slug: "project-four",
    title: "Project One",
    description:
      "A placeholder project description. Replace with a summary of the problem, your approach, and the outcome.",
    image: "/placeholder-project.svg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/your-username/project-one",
    liveUrl: "https://example.com",
    status: "Live",
    tags: ["Web App"],
  },
  {
    slug: "project-five",
    title: "Project Two",
    description:
      "A placeholder project description. Replace with a summary of the problem, your approach, and the outcome.",
    image: "/placeholder-project.svg",
    technologies: ["React", "Node.js", "Express"],
    githubUrl: "https://github.com/your-username/project-two",
    status: "In Progress",
    tags: ["API"],
  },
  {
    slug: "project-six",
    title: "Project Three",
    description:
      "A placeholder project description. Replace with a summary of the problem, your approach, and the outcome.",
    image: "/placeholder-project.svg",
    technologies: ["Docker", "Oracle Cloud Infrastructure"],
    githubUrl: "https://github.com/your-username/project-three",
    liveUrl: "https://example.com",
    status: "Live",
    tags: ["DevOps"],
  },
];
