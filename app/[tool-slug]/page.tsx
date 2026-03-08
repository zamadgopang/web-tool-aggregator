import { notFound } from "next/navigation"
import { tools, getToolBySlug, type Tool } from "@/lib/tools"
import { ToolPageLayout } from "@/components/tool-page-layout"
import { ImageConverter } from "@/components/tools/image-converter"
import { ComingSoon } from "@/components/tools/coming-soon"
import type { Metadata } from "next"

// Helper to ensure tool data is serializable for client components
function serializeTool(tool: Tool): Tool {
  return {
    id: tool.id,
    slug: tool.slug,
    title: tool.title,
    description: tool.description,
    longDescription: tool.longDescription,
    iconName: tool.iconName,
    tag: tool.tag,
    category: tool.category,
    inputFormats: tool.inputFormats,
    outputFormats: tool.outputFormats,
  }
}

interface ToolPageProps {
  params: Promise<{
    "tool-slug": string
  }>
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    "tool-slug": tool.slug,
  }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { "tool-slug": slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    return {
      title: "Tool Not Found — ToolKit",
    }
  }

  return {
    title: `${tool.title} — ToolKit`,
    description: tool.longDescription,
  }
}

function getToolComponent(slug: string) {
  switch (slug) {
    case "image-converter":
    case "heic-to-jpg":
    case "webp-to-png":
    case "svg-to-png":
      return <ImageConverter />
    default:
      return <ComingSoon />
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { "tool-slug": slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  // Ensure we pass only serializable data to the client component
  const serializedTool = serializeTool(tool)

  return (
    <ToolPageLayout tool={serializedTool}>
      {getToolComponent(slug)}
    </ToolPageLayout>
  )
}
