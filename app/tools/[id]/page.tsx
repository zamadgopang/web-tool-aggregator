import { tools, getToolById, siteConfig } from "@/lib/tools-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ToolPageClient } from "./tool-page-client"

interface ToolPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return tools.map((tool) => ({ id: tool.id }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { id } = await params
  const tool = getToolById(id)

  if (!tool) {
    return { title: "Tool Not Found" }
  }

  const title = `${tool.title} — Free Online Tool`
  const description = `${tool.description} Free, fast, and runs 100% in your browser. No sign-up required.`
  const url = `${siteConfig.url}/tools/${tool.id}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { id } = await params
  const tool = getToolById(id)

  if (!tool) {
    notFound()
  }

  return <ToolPageClient toolId={id} />
}
