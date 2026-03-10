"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AgencyCTA() {
  return (
    <section className="relative overflow-hidden" aria-label="Custom development services">
      {/* Top section — dark in light mode, light in dark mode */}
      <div className="bg-foreground/95 backdrop-blur-xl py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-sm font-medium text-background/80 mb-6">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Custom Development
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl">
              Need something custom?
              <br />
              Let&apos;s build it together.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-background/60">
              ZamDev builds fast, modern web apps, tools, and SaaS products.
              If you need a tailored solution, let&apos;s talk.
            </p>
            <Button asChild size="lg" className="mt-8 gap-2 bg-background text-foreground hover:bg-background/90 border-0 shadow-lg">
              <a href="https://zamdev.me" target="_blank" rel="noopener noreferrer">
                Work with ZamDev
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
