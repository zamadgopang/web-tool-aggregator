import { ImageResponse } from "next/og"
import { getToolById, tools } from "@/lib/tools-data"

export const runtime = "edge"
export const alt = "Tool by ZamDev"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateStaticParams() {
  return tools.map((tool) => ({ id: tool.id }))
}

const categoryColors: Record<string, { bg: string; text: string; accent: string }> = {
  developer: { bg: "#064e3b", text: "#6ee7b7", accent: "#10b981" },
  image: { bg: "#4c1d95", text: "#c4b5fd", accent: "#8b5cf6" },
  text: { bg: "#1e3a5f", text: "#93c5fd", accent: "#3b82f6" },
  utility: { bg: "#78350f", text: "#fde68a", accent: "#f59e0b" },
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tool = getToolById(id)

  const title = tool?.title ?? "Tool"
  const description = tool?.description ?? "A free browser tool by ZamDev"
  const category = tool?.category ?? "utility"
  const tag = tool?.tag ?? "Free"
  const colors = categoryColors[category] ?? categoryColors.utility

  // Truncate description for display
  const shortDesc = description.length > 120 ? description.slice(0, 117) + "..." : description

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
        }}
      >
        {/* Top row: Logo + Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 40,
          }}
        >
          {/* ZamDev Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                backgroundColor: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #333",
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: -1,
                }}
              >
                Z
              </span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 600, color: "#a1a1aa" }}>
              zamdev
            </span>
          </div>

          {/* Tag badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: 20,
              backgroundColor: colors.bg,
              border: `1px solid ${colors.accent}`,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>
              {tag}
            </span>
          </div>
        </div>

        {/* Tool Title */}
        <span
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: -1,
          }}
        >
          {title}
        </span>

        {/* Description */}
        <span
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            lineHeight: 1.5,
            marginBottom: 40,
            maxWidth: 900,
          }}
        >
          {shortDesc}
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Features */}
          <div style={{ display: "flex", gap: 12 }}>
            {["Free", "No Sign-up", "100% Client-side"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: 14,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                }}
              >
                <span style={{ fontSize: 14, color: "#d4d4d8" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* URL */}
          <span style={{ fontSize: 18, color: "#71717a" }}>
            tools.zamdev.me
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
