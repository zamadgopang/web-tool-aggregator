"use client"

import { useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryFilter } from "@/components/category-filter"
import { ToolGrid } from "@/components/tool-grid"
import { CommandSearch } from "@/components/command-search"
import { AgencyCTA } from "@/components/agency-cta"
import { SkeletonGrid } from "@/components/skeleton-card"
import Link from "next/link"

export function HomeClient() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
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
      </main>

      <AgencyCTA />

      <footer className="border-t border-border bg-muted/30" role="contentinfo">
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
