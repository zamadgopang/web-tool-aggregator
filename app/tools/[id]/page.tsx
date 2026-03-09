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

  const categoryLabels: Record<string, string> = {
    developer: "Developer Tools",
    image: "Image Tools",
    text: "Text Tools",
    utility: "Utility Tools",
  }

  return {
    title,
    description,
    keywords: [
      tool.title.toLowerCase(),
      `free ${tool.title.toLowerCase()}`,
      `online ${tool.title.toLowerCase()}`,
      tool.category,
      "browser tool",
      "free tool",
      "ZamDev",
      categoryLabels[tool.category] || "",
    ].filter(Boolean),
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

  // SoftwareApplication schema for individual tool (GEO)
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: `${tool.description} Free, fast, and runs 100% in your browser.`,
    url: `${siteConfig.url}/tools/${tool.id}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "ZamDev",
      url: "https://zamdev.me",
    },
    isPartOf: {
      "@type": "WebApplication",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.title,
        item: `${siteConfig.url}/tools/${tool.id}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolPageClient toolId={id} />
    </>
  )
}
