import type { MetadataRoute } from "next"
import { tools, siteConfig } from "@/lib/tools-data"
import { pseoVariants } from "@/lib/pseo-data"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...tools.map((tool) => ({
      url: `${siteConfig.url}/tools/${tool.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: tool.popular ? 0.9 : 0.7,
    })),
    ...pseoVariants.map((variant) => ({
      url: `${siteConfig.url}/${variant.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
