import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { PWARegister } from '@/components/pwa-register'
import { tools } from '@/lib/tools-data'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://tools.zamdev.me"
const siteName = "Tools by ZamDev"
const siteDescription =
  "30+ free, lightning-fast browser tools for developers and designers. Convert images, format JSON, generate passwords, QR codes, audit SEO performance, and more — all running 100% client-side with zero server delays. Your files never leave your device."

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Free Browser Tools`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "free online tools",
    "browser tools",
    "developer tools",
    "JSON formatter",
    "image converter",
    "password generator",
    "QR code generator",
    "Base64 converter",
    "color converter",
    "hash generator",
    "regex tester",
    "JWT decoder",
    "unit converter",
    "CSS gradient generator",
    "UUID generator",
    "client-side tools",
    "privacy-first tools",
    "SEO auditor",
    "website performance checker",
    "Lighthouse scores",
    "Core Web Vitals",
    "markdown preview",
    "DOCX to PDF",
    "meta tag generator",
    "cron parser",
    "SQL formatter",
    "text diff checker",
    "ZamDev",
  ],
  authors: [{ name: "ZamDev", url: "https://zamdev.me" }],
  creator: "ZamDev",
  publisher: "ZamDev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} — 30+ Free Browser Tools`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — 30+ Free Browser Tools`,
    description: siteDescription,
    creator: "@zamdev",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in all modern browsers.",
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
    featureList: tools.map((t) => t.title),
  }

  // ItemList schema for tool discovery (GEO)
  const toolListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free Browser Tools by ZamDev",
    description: "A curated collection of 30+ free browser-based developer and designer tools.",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      description: tool.description,
      url: `${siteUrl}/tools/${tool.id}`,
    })),
  }

  // FAQ schema for GEO — helps AI engines understand common questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are these tools really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all 30+ tools on Tools by ZamDev are completely free to use with no sign-up, no ads, and no usage limits.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data safe when using these tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Most tools run 100% client-side in your browser. Your files and data never leave your device. No data is uploaded to any server for processing.",
        },
      },
      {
        "@type": "Question",
        name: "What is the SEO & Performance Auditor tool?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The SEO & Performance Auditor analyzes any website's SEO health, Google Lighthouse scores (Performance, SEO, Accessibility), Core Web Vitals (FCP, LCP, TBT, CLS), security headers, Open Graph tags, structured data, and heading structure. It uses the Google PageSpeed Insights API for Lighthouse data.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to install anything?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No installation required. All tools work directly in your web browser. You can also install it as a Progressive Web App (PWA) for offline access.",
        },
      },
      {
        "@type": "Question",
        name: "What tools are available for developers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Developer tools include JSON Formatter, Regex Tester, JWT Decoder, JSON to TypeScript converter, YAML/JSON converter, Cron Parser, SQL Formatter, HTML Entity Encoder, Meta Tag Generator, Chmod Calculator, Python Compiler, and SEO & Performance Auditor.",
        },
      },
    ],
  }

  // Organization schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZamDev",
    url: "https://zamdev.me",
    logo: `${siteUrl}/ZamDev_light_logo.png`,
    sameAs: [],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toolListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <PWARegister />
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M997853FSJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M997853FSJ');
          `}
        </Script>
      </body>
    </html>
  )
}
