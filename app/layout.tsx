import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://tools.zamdev.me"
const siteName = "Tools by ZamDev"
const siteDescription =
  "30+ free, lightning-fast browser tools for developers and designers. Convert images, format JSON, generate passwords, QR codes, and more — all running 100% client-side with zero server delays. Your files never leave your device."

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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — Free, Lightning-Fast Browser Tools`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — 30+ Free Browser Tools`,
    description: siteDescription,
    images: ["/og-image.png"],
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
    featureList: [
      "JSON Formatter",
      "Image Converter",
      "Password Generator",
      "QR Code Generator",
      "Color Converter",
      "Hash Generator",
      "Regex Tester",
      "JWT Decoder",
      "Base64 Converter",
      "Unit Converter",
      "UUID Generator",
      "CSS Gradient Generator",
    ],
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
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
