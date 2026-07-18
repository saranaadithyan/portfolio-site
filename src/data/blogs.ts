export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  url: string;
};

// Leave empty until real posts exist; Blogs section shows a placeholder state.
export const blogPosts: BlogPost[] = [
  {
    slug: "building-scalable-react-applications",
    title: "Building Scalable React Applications: Best Practices for Modern Development",
    summary:
      "Explore practical techniques for structuring large React applications using reusable components, clean architecture, state management, and performance optimization to build maintainable and scalable web applications.",
    coverImage: "/placeholder-certificate.svg",
    category: "Web Development",
    publishedAt: "July 18, 2026",
    readingTime: "8 min read",
    url: "",
  },
  {
    slug: "getting-started-with-nextjs-app-router",
    title: "Getting Started with Next.js App Router",
    summary:
      "Learn how the Next.js App Router simplifies routing, layouts, server components, and data fetching while improving performance and developer experience.",
    coverImage: "/placeholder-certificate.svg",
    category: "Next.js",
    publishedAt: "June 30, 2026",
    readingTime: "6 min read",
    url: "",
  },
  {
    slug: "introduction-to-oracle-cloud-infrastructure",
    title: "Getting Started with Oracle Cloud Infrastructure (OCI)",
    summary:
      "An introductory guide to Oracle Cloud Infrastructure covering core services, networking, compute instances, storage, IAM, and best practices for beginners.",
    coverImage: "/placeholder-certificate.svg",
    category: "Cloud",
    publishedAt: "June 10, 2026",
    readingTime: "10 min read",
    url: "",
  },
];