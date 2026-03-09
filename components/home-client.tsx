"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryFilter } from "@/components/category-filter"
import { ToolGrid } from "@/components/tool-grid"
import { ToolMapper } from "@/components/tool-mapper"
import { CommandSearch } from "@/components/command-search"
import { AgencyCTA } from "@/components/agency-cta"

export function HomeClient() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearchClick={() => setSearchOpen(true)} />
        <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} onToolSelect={setSelectedTool} />
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ToolMapper toolId={selectedTool} onBack={() => setSelectedTool(null)} />
        </main>

        <AgencyCTA />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchClick={() => setSearchOpen(true)} />
      <CommandSearch 
        open={searchOpen} 
        onOpenChange={setSearchOpen}
        onToolSelect={setSelectedTool}
      />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />
        
        <section className="pb-16">
          <div className="mb-8">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          <ToolGrid activeCategory={activeCategory} onToolClick={setSelectedTool} />
        </section>
      </main>

      <AgencyCTA />
      
      <footer className="border-t border-border py-8">
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
