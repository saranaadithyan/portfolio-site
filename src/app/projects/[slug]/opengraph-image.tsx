import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#d4d6d4",
          color: "#282929",
        }}
      >
        <div style={{ fontSize: 28, color: "#7c7d80", letterSpacing: 4, textTransform: "uppercase" }}>
          Project
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
          {project?.title ?? "Project"}
        </div>
        <div style={{ fontSize: 32, color: "#444444" }}>
          {project?.technologies.slice(0, 4).join(" · ") ?? site.name}
        </div>
      </div>
    ),
    size,
  );
}
