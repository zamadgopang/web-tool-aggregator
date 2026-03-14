import { pseoVariants, getVariantBySlug } from "@/lib/pseo-data"
import { getToolById, siteConfig } from "@/lib/tools-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PseoPageTemplate } from "@/components/pseo-page-template"

interface PseoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return pseoVariants.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: PseoPageProps): Promise<Metadata> {
  const { slug } = await params
  const variant = getVariantBySlug(slug)

  if (!variant) {
    return { title: "Page Not Found" }
  }

  const tool = getToolById(variant.toolId)
  const url = `${siteConfig.url}/${variant.slug}`

  return {
    title: variant.metaTitle,
    description: variant.metaDescription,
    keywords: [
      variant.keyword,
      tool?.title?.toLowerCase() || "",
      "free online tool",
      "browser tool",
      "no sign-up",
      "ZamDev",
    ].filter(Boolean),
    openGraph: {
      title: variant.metaTitle,
      description: variant.metaDescription,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: variant.metaTitle,
      description: variant.metaDescription,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PseoPage({ params }: PseoPageProps) {
  const { slug } = await params
  const variant = getVariantBySlug(slug)

  if (!variant) {
    notFound()
  }

  const tool = getToolById(variant.toolId)

  if (!tool) {
    notFound()
  }

  // SoftwareApplication schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: variant.keyword,
    description: variant.metaDescription,
    url: `${siteConfig.url}/${variant.slug}`,
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

  // FAQPage schema
  const faqSchema =
    variant.faq && variant.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: variant.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null

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
      {
        "@type": "ListItem",
        position: 3,
        name: variant.keyword,
        item: `${siteConfig.url}/${variant.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PseoPageTemplate variant={variant} tool={tool} />
    </>
  )
}
