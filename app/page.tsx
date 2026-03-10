import { HomeClient } from "@/components/home-client"

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient />
    </>
  )
}
