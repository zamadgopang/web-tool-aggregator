import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tools.zamdev.me"

  const tools = [
    "json-formatter",
    "image-converter",
    "color-converter",
    "qr-code-generator",
    "password-generator",
    "hash-generator",
    "unit-converter",
    "image-cropper-resizer",
    "regex-tester",
    "markdown-preview",
    "jwt-decoder",
    "json-to-typescript",
    "yaml-json-converter",
    "cron-parser",
    "sql-formatter",
    "html-entity-encoder",
    "meta-tag-generator",
    "chmod-calculator",
    "text-minifier",
    "base64-converter",
    "url-encoder-decoder",
    "text-diff-checker",
    "lorem-ipsum-generator",
    "timestamp-converter",
    "uuid-generator",
    "css-gradient-generator",
    "css-box-shadow-generator",
    "aspect-ratio-calculator",
    "color-palette-generator",
    "svg-to-png",
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${baseUrl}/#${tool}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
