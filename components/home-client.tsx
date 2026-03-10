"use client"

import { useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryFilter } from "@/components/category-filter"
import { ToolGrid } from "@/components/tool-grid"
import { CommandSearch } from "@/components/command-search"
import { AgencyCTA } from "@/components/agency-cta"
import { SkeletonGrid } from "@/components/skeleton-card"
import { Zap, Shield, DollarSign, ChevronDown } from "lucide-react"
import Link from "next/link"

function HomeFaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card/40 backdrop-blur-md">
      <button
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export function HomeClient() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background bg-glass-gradient">
      <Header onSearchClick={() => setSearchOpen(true)} />
      <CommandSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />

        <section className="pb-16" aria-label="Tool categories and grid">
          <div className="mb-8">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <Suspense fallback={<SkeletonGrid count={12} />}>
            <ToolGrid activeCategory={activeCategory} />
          </Suspense>
        </section>

        {/* Why Use ZamDev Tools Section */}
        <section className="pb-16" aria-label="Why use ZamDev Tools">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
            Why Use ZamDev Tools?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card/50 backdrop-blur-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 mb-4">
                <Zap className="h-6 w-6 text-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Speed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every tool runs entirely in your browser. No file uploads, no server processing, no waiting. Results appear instantly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card/50 backdrop-blur-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 mb-4">
                <Shield className="h-6 w-6 text-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Complete Privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your files and data never leave your device. All processing happens locally using modern browser APIs — no tracking, no data collection.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card/50 backdrop-blur-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 mb-4">
                <DollarSign className="h-6 w-6 text-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">100% Free</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No sign-ups, no subscriptions, no hidden fees. All 30+ tools are completely free to use with no limitations or watermarks.
              </p>
            </div>
          </div>
        </section>

        {/* Who Is This For Section */}
        <section className="pb-16" aria-label="Who is this for">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
            Built for Everyone
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-lg">
              <h3 className="font-semibold text-foreground mb-2">Developers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Format JSON, decode JWTs, test regex, generate TypeScript interfaces, parse cron expressions, and hash data — all essential developer utilities in one place.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-lg">
              <h3 className="font-semibold text-foreground mb-2">Designers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Convert and resize images, generate color palettes, create CSS gradients and shadows, calculate aspect ratios, and export SVGs — design workflow essentials.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-lg">
              <h3 className="font-semibold text-foreground mb-2">Marketers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Audit SEO performance, generate meta tags, create QR codes, convert documents to PDF, and optimize images for web — tools that boost your digital presence.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-lg">
              <h3 className="font-semibold text-foreground mb-2">Students</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Run Python code in the browser, convert units, generate passwords, compare text differences, and learn Markdown — study and project helpers with zero setup.
              </p>
            </div>
          </div>
        </section>

        {/* Home Page FAQ Section */}
        <section className="pb-16 max-w-3xl mx-auto" aria-label="Frequently asked questions">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            <HomeFaqItem
              question="Are these tools really free?"
              answer="Yes, all 30+ tools on ZamDev Tools are completely free to use. There are no hidden fees, no premium tiers, and no sign-up required. Just open a tool and start using it."
            />
            <HomeFaqItem
              question="Is my data safe when using these tools?"
              answer="Absolutely. Every tool runs 100% in your browser using client-side JavaScript. Your files, text, and data are never uploaded to any server. Once you close the tab, your data is gone — we never store or access it."
            />
            <HomeFaqItem
              question="Do I need to create an account?"
              answer="No. All tools work instantly without any registration, login, or email verification. Just visit the tool page and start using it right away."
            />
            <HomeFaqItem
              question="What browsers are supported?"
              answer="ZamDev Tools work on all modern browsers including Chrome, Firefox, Safari, and Edge. They also work on mobile browsers, so you can use them on your phone or tablet."
            />
            <HomeFaqItem
              question="Can I use these tools offline?"
              answer="ZamDev Tools is a Progressive Web App (PWA). After your first visit, you can install it and many tools will work offline since they don't require any server communication."
            />
            <HomeFaqItem
              question="What does 'client-side' mean?"
              answer="Client-side means the tool runs entirely in your web browser using JavaScript, WebAssembly, or the HTML5 Canvas API. Your data is processed on your device — nothing is sent to a remote server. This makes the tools faster, more private, and usable even without a stable internet connection."
            />
            <HomeFaqItem
              question="How is ZamDev Tools different from other online tool websites?"
              answer="Most online tool websites upload your files to their servers for processing, which raises privacy concerns and adds latency. ZamDev Tools process everything locally in your browser — your files never leave your device. There are also no ads, no sign-up walls, and no usage limits."
            />
            <HomeFaqItem
              question="Can I use these tools for commercial projects?"
              answer="Yes. All tools are free for personal and commercial use. There are no restrictions on how you use the output — generated passwords, converted images, formatted code, and all other results are yours to use however you like."
            />
            <HomeFaqItem
              question="Do you track my usage or collect analytics?"
              answer="We use minimal, privacy-respecting analytics (Vercel Analytics) to understand overall traffic patterns. We never track individual tool usage, never record the data you enter into any tool, and never sell any user data."
            />
            <HomeFaqItem
              question="How do I install ZamDev Tools as an app?"
              answer="On desktop Chrome or Edge, click the install icon in the address bar. On mobile, use 'Add to Home Screen' from the browser menu. Once installed, ZamDev Tools appears as a standalone app with offline support for many tools."
            />
            <HomeFaqItem
              question="Are the tools open source?"
              answer="Yes. ZamDev Tools is open source. You can review the code, suggest improvements, or contribute new tools via the GitHub repository."
            />
            <HomeFaqItem
              question="What technology powers these tools?"
              answer="ZamDev Tools is built with Next.js 14, React, TypeScript, and Tailwind CSS. Individual tools use modern browser APIs including the Web Crypto API, Canvas API, WebAssembly (for Python), and the File API for local processing."
            />
          </div>
        </section>

        {/* About / SEO paragraph */}
        <section className="pb-16 max-w-3xl mx-auto text-center" aria-label="About ZamDev Tools">
          <h2 className="text-lg font-semibold text-foreground mb-4">About ZamDev Tools</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            ZamDev Tools is a comprehensive collection of 30+ free, open-source browser tools built for developers, designers, marketers, and everyday users.
            From image conversion and JSON formatting to password generation, color palette creation, and full SEO auditing, every tool is designed to be
            fast, private, and easy to use. Built with Next.js and modern web technologies, all tools run entirely client-side — your
            files never leave your device.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Unlike other online tool websites that upload your data to servers, ZamDev Tools processes everything in your browser using modern APIs
            like the Web Crypto API, HTML5 Canvas, and WebAssembly. This means zero latency, complete privacy, and tools that work even with limited
            internet connectivity. No accounts, no watermarks, no usage limits — just powerful utilities that respect your time and your data.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Created and maintained by{" "}
            <a href="https://zamdev.me" className="text-foreground underline underline-offset-4 hover:text-foreground/80" target="_blank" rel="noopener noreferrer">
              ZamDev
            </a>. New tools and improvements are added regularly. Bookmark this page and come back whenever you need a fast, private, free online tool.
          </p>
        </section>
      </main>

      <AgencyCTA />

      <footer className="border-t border-border bg-card/30 backdrop-blur-xl" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-bold text-foreground text-lg">Tools by ZamDev</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                30+ free, lightning-fast browser tools for developers and designers. Your files never leave your device.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Popular Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools/json-formatter" className="text-muted-foreground hover:text-foreground transition-colors">JSON Formatter</Link></li>
                <li><Link href="/tools/image-converter" className="text-muted-foreground hover:text-foreground transition-colors">Image Converter</Link></li>
                <li><Link href="/tools/seo-performance-auditor" className="text-muted-foreground hover:text-foreground transition-colors">SEO Auditor</Link></li>
                <li><Link href="/tools/password-generator" className="text-muted-foreground hover:text-foreground transition-colors">Password Generator</Link></li>
                <li><Link href="/tools/qr-code-generator" className="text-muted-foreground hover:text-foreground transition-colors">QR Code Generator</Link></li>
              </ul>
            </div>

            {/* More Tools */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">More Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools/markdown-preview" className="text-muted-foreground hover:text-foreground transition-colors">Markdown Preview</Link></li>
                <li><Link href="/tools/color-converter" className="text-muted-foreground hover:text-foreground transition-colors">Color Converter</Link></li>
                <li><Link href="/tools/regex-tester" className="text-muted-foreground hover:text-foreground transition-colors">Regex Tester</Link></li>
                <li><Link href="/tools/base64-converter" className="text-muted-foreground hover:text-foreground transition-colors">Base64 Converter</Link></li>
                <li><Link href="/tools/css-gradient-generator" className="text-muted-foreground hover:text-foreground transition-colors">CSS Gradient Generator</Link></li>
              </ul>
            </div>

            {/* Legal & Info */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://zamdev.me" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">About ZamDev</a></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ZamDev. All rights reserved.</p>
            <p>All tools run 100% in your browser &bull; No ads &bull; Open source</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
