import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Tools by ZamDev — 30+ Free, Lightning-Fast Browser Tools"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 22,
            backgroundColor: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Z
          </span>
        </div>

        {/* Title */}
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Tools by ZamDev
        </span>

        {/* Subtitle */}
        <span
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            marginBottom: 48,
          }}
        >
          30+ Free, Lightning-Fast Browser Tools
        </span>

        {/* Tags */}
        <div style={{ display: "flex", gap: 16 }}>
          {["100% Client-side", "Privacy First", "Zero Latency"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 24px",
                borderRadius: 18,
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
              }}
            >
              <span style={{ fontSize: 14, color: "#d4d4d8" }}>{tag}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <span
          style={{
            fontSize: 18,
            color: "#71717a",
            marginTop: 48,
          }}
        >
          tools.zamdev.me
        </span>
      </div>
    ),
    { ...size }
  )
}
