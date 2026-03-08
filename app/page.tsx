"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryFilter } from "@/components/category-filter"
import { ToolGrid } from "@/components/tool-grid"
import { ToolMapper } from "@/components/tool-mapper"
import { CommandSearch } from "@/components/command-search"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearchClick={() => setSearchOpen(true)} />
        <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
        
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ToolMapper toolId={selectedTool} onBack={() => setSelectedTool(null)} />
        </main>
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
      
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            All tools run 100% in your browser. Your files never leave your device.
          </p>
        </div>
      </footer>
    </div>
  )
}
