import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Tenzok — We turn projects into careers";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0c0e",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="36" height="36" viewBox="0 0 256 256" fill="#e8702a">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span style={{ fontSize: 34, color: "#f2f3f5" }}>Tenzok</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 76,
              color: "#f2f3f5",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            We turn projects into careers.
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "#a8acb4",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            An engineering studio that builds real software — with students, and for
            companies.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ height: 4, width: 56, background: "#e8702a" }} />
          <span style={{ fontSize: 24, color: "#7e838c" }}>{SITE.tagline}</span>
        </div>
      </div>
    ),
    size,
  );
}
