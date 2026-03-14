"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CommandSearch } from "@/components/command-search"
import { ToolMapper } from "@/components/tool-mapper"
import { DataFactSheet } from "@/components/data-fact-sheet"
import { FeatureMatrix } from "@/components/feature-matrix"
import { ConversationalQA } from "@/components/conversational-qa"
import { RelatedUtilities } from "@/components/related-utilities"
import { AgencyCTA } from "@/components/agency-cta"
import { type PseoVariant } from "@/lib/pseo-data"
import { type ToolMeta } from "@/lib/tools-data"

interface PseoPageTemplateProps {
  variant: PseoVariant
  tool: ToolMeta
}

export function PseoPageTemplate({ variant, tool }: PseoPageTemplateProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background glass-mesh-bg">
      <Header onSearchClick={() => setSearchOpen(true)} />
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Ambient color blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[120px]" />
          <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-violet-400/10 dark:bg-violet-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-rose-400/8 dark:bg-rose-500/8 blur-[120px]" />
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Hero section with keyword-injected H1 */}
          <section aria-label="Introduction" className="pt-8 pb-6">
            <header>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {variant.keyword}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {tool.description} Free, fast, and runs 100% in your browser.
              </p>
            </header>
            <div className="mt-6 text-sm text-muted-foreground leading-relaxed">
              <p>{variant.intro}</p>
            </div>
          </section>

          {/* Interactive Tool */}
          <section aria-label={`${tool.title} tool`} className="mb-8">
            <ToolMapper toolId={tool.id} />
          </section>

          {/* AI Crawler Data Panel */}
          <div className="mb-8">
            <DataFactSheet toolName={tool.title} toolFunction={tool.description} />
          </div>

          {/* Feature Matrix */}
          <div className="mb-8">
            <FeatureMatrix toolName={tool.title} rows={variant.featureRows} />
          </div>

          {/* Conversational Q&A */}
          <div className="mb-8">
            <ConversationalQA faq={variant.faq} />
          </div>

          {/* Related Utilities */}
          <div className="mb-12">
            <RelatedUtilities relatedSlugs={variant.relatedSlugs} />
          </div>
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
