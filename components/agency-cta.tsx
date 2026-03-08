"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AgencyCTA() {
  return (
    <section className="relative border-t border-border overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/5 via-violet-600/10 to-pink-600/5 dark:from-blue-500/10 dark:via-violet-500/15 dark:to-pink-500/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-6">
            <Sparkles className="h-4 w-4" />
            Custom Development
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">Need something custom?</span>
            <br />
            <span className="text-foreground">Let&apos;s build it together.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            ZamDev builds fast, modern web apps, tools, and SaaS products.
            If you need a tailored solution, let&apos;s talk.
          </p>
          <Button asChild size="lg" className="mt-8 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0 shadow-lg shadow-violet-500/25">
            <a href="https://zamdev.me" target="_blank" rel="noopener noreferrer">
              Work with ZamDev
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
