"use client"

import { useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryFilter } from "@/components/category-filter"
import { ToolGrid } from "@/components/tool-grid"
import { CommandSearch } from "@/components/command-search"
import { AgencyCTA } from "@/components/agency-cta"
import { SkeletonGrid } from "@/components/skeleton-card"

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
