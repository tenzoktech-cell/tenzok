import { ImageResponse } from "next/og";
import { POSTS, getPost } from "@/components/blog-posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Tenzok article";

export function generateStaticParams() {
  return POSTS.map(({ slug }) => ({ slug }));
}

// Next 16: params is a Promise in image-generating functions.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Tenzok";
  const tags = post?.tags.join("  ·  ") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 84% 20%, #342780 0%, #08090d 46%, #08090d 100%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="32" height="32" viewBox="0 0 256 256" fill="#8b6cff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span style={{ fontSize: 30, color: "#f7f8fc" }}>Tenzok</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: title.length > 60 ? 56 : 68,
              color: "#f7f8fc",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ height: 4, width: 48, background: "#8b6cff" }} />
          <span style={{ fontSize: 24, color: "#747b90" }}>{tags}</span>
        </div>
      </div>
    ),
    size,
  );
}
