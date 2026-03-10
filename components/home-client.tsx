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

function HomeFaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
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

        {/* Why Use ZamDev Tools Section */}
        <section className="pb-16" aria-label="Why use ZamDev Tools">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
            Why Use ZamDev Tools?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 mb-4">
                <Zap className="h-6 w-6 text-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Speed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every tool runs entirely in your browser. No file uploads, no server processing, no waiting. Results appear instantly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 mb-4">
                <Shield className="h-6 w-6 text-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Complete Privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your files and data never leave your device. All processing happens locally using modern browser APIs — no tracking, no data collection.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card">
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
          </div>
        </section>

        {/* About / SEO paragraph */}
        <section className="pb-16 max-w-3xl mx-auto text-center" aria-label="About ZamDev Tools">
          <p className="text-sm text-muted-foreground leading-relaxed">
            ZamDev Tools is a collection of 30+ free, open-source browser tools built for developers, designers, and everyday users.
            From image conversion and JSON formatting to password generation and color palette creation, every tool is designed to be
            fast, private, and easy to use. Built with Next.js and modern web technologies, all tools run entirely client-side — your
            files never leave your device. Created and maintained by{" "}
            <a href="https://zamdev.me" className="text-foreground underline underline-offset-4 hover:text-foreground/80" target="_blank" rel="noopener noreferrer">
              ZamDev
            </a>.
          </p>
        </section>
      </main>

      <AgencyCTA />

      <footer className="border-t border-border py-8" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>All tools run 100% in your browser. Your files never leave your device.</p>
            <p className="text-xs">30+ free tools &bull; No ads &bull; Open source</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
