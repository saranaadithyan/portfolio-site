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
    title: "Offline Product Pricing App",
    description:
      "A cross-platform mobile application developed with Flutter for offline product catalog management and dynamic price calculation.",
    image: "/placeholder-project.png",
    technologies: ["Flutter", "Dart"],
    githubUrl: "",
    liveUrl: "",
    status: "Live",
    tags: ["Mobile App"],
  },
  {
    slug: "project-two",
    title: "Attendance Management App",
    description:
      "An offline-first attendance management system built with React Native, designed for admin-controlled employee tracking with comprehensive reporting features.",
    image: "/placeholder-project.png",
    technologies: ["React", "React Native", "Offline","Native Modules (Android)"],
    githubUrl: "",
    status: "Live",
    tags: ["Mobile App"],
  },
  {
    slug: "project-three",
    title: "Inventory Management App",
    description:
      "An inventory management system built with React Native, featuring real-time tracking, stock management, and reporting capabilities.",
    image: "/placeholder-project.png",
    technologies: ["React", "React Native", "Offline", "Native Modules (Android)"],
    githubUrl: "",
    liveUrl: "",
    status: "Live",
    tags: ["Mobile App"],
  },
  
];
