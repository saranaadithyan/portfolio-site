import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#d4d6d4",
          color: "#282929",
        }}
      >
        <div style={{ fontSize: 28, color: "#7c7d80", letterSpacing: 4, textTransform: "uppercase" }}>
          Portfolio
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 16 }}>{site.name}</div>
        <div style={{ fontSize: 40, color: "#444444", marginTop: 16 }}>{site.title}</div>
      </div>
    ),
    size,
  );
}
