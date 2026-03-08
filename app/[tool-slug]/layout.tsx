"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CommandSearch } from "@/components/command-search"

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <Header onSearchClick={() => setIsSearchOpen(true)} />
      {children}
      <CommandSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
