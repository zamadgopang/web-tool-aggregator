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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* H1 Heading for SEO */}
        <div className="pt-8 pb-2 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {tool.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {tool.description} Free, fast, and runs 100% in your browser.
          </p>
        </div>

        <ToolMapper toolId={toolId} />

        <ToolSeoContent tool={tool} />
      </main>

      <AgencyCTA />

      <footer className="border-t border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl dark:backdrop-blur-2xl backdrop-saturate-150 dark:backdrop-saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] py-8" role="contentinfo">
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
