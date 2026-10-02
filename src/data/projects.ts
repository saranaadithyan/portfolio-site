export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  status: "Live" | "In Progress" | "Archived";
  technologies: string[];
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  order: number;
  images: ProjectImage[]; // 1-3 entries; the first is the card cover
};
