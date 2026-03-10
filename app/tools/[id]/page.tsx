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
    keywords: tool.keywords,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    url: `${siteConfig.url}/tools/${tool.id}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
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
  }

  const faqJsonLd = tool.faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ToolPageClient toolId={id} tool={tool} />
    </>
  )
}
