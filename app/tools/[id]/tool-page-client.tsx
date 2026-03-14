"use client"

import { Header } from "@/components/header"
import { ToolMapper } from "@/components/tool-mapper"
import { CommandSearch } from "@/components/command-search"
import { ToolSeoContent } from "@/components/tool-seo-content"
import { AgencyCTA } from "@/components/agency-cta"
import { type ToolMeta } from "@/lib/tools-data"
import { useState } from "react"

interface ToolPageClientProps {
  toolId: string
  tool: ToolMeta
}

export function ToolPageClient({ toolId, tool }: ToolPageClientProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background glass-mesh-bg">
      <Header onSearchClick={() => setSearchOpen(true)} />
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article>
        {/* Ambient color blobs — give the glass cards something to refract */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[120px]" />
          <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-violet-400/10 dark:bg-violet-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-rose-400/8 dark:bg-rose-500/8 blur-[120px]" />
        </div>
        {/* H1 Heading for SEO */}
        <header className="pt-8 pb-2 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {tool.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {tool.description} Free, fast, and runs 100% in your browser.
          </p>
        </header>

        <ToolMapper toolId={toolId} />

        <ToolSeoContent tool={tool} />
        </article>
      </main>

      <AgencyCTA />

      <footer className="border-t border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] py-8" role="contentinfo">
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
