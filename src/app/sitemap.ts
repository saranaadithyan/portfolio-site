import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllPosts } from "@/lib/blog";
import { getAllProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/blog`,
      lastModified: posts[0] ? new Date(posts[0].updatedAt ?? posts[0].publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getAllProjects().map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
