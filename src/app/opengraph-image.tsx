import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Tenzok — Build software. Launch ideas. Ship with confidence.";

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
          background:
            "radial-gradient(circle at 84% 20%, #342780 0%, #08090d 46%, #08090d 100%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="36" height="36" viewBox="0 0 256 256" fill="#8b6cff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span style={{ fontSize: 34, color: "#f7f8fc" }}>Tenzok</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 76,
              color: "#f7f8fc",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Build software. Launch ideas. Ship with confidence.
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "#aeb4c5",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Product engineering for companies, founders, and students—from first
            scope to launch and complete handover.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ height: 4, width: 56, background: "#8b6cff" }} />
          <span style={{ fontSize: 24, color: "#747b90" }}>{SITE.tagline}</span>
        </div>
      </div>
    ),
    size,
  );
}
