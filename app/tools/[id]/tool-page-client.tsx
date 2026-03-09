"use client"

import { Header } from "@/components/header"
import { ToolMapper } from "@/components/tool-mapper"
import { CommandSearch } from "@/components/command-search"
import { useState } from "react"

interface ToolPageClientProps {
  toolId: string
  toolTitle: string
}

export function ToolPageClient({ toolId, toolTitle }: ToolPageClientProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchClick={() => setSearchOpen(true)} />
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ToolMapper toolId={toolId} />
      </main>
    </div>
  )
}
