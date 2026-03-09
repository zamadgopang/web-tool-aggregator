"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"

interface HeaderProps {
  onSearchClick: () => void
}

export function Header({ onSearchClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl" role="banner">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3" aria-label="ZamDev Tools — Go to homepage">
          {mounted && (
            <img
              src={theme === "dark" ? "/ZamDev_Dark_logo.png" : "/ZamDev_light_logo.png"}
              alt="ZamDev Logo"
              className="h-8 w-auto"
            />
          )}
          <span className="text-xl font-bold text-foreground">Tools</span>
        </Link>

        {/* Desktop search bar */}
        <button
          onClick={onSearchClick}
          aria-label="Search tools (Ctrl+K)"
          className="hidden sm:flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground hover:border-muted-foreground/30 w-72"
        >
          <Command className="h-4 w-4" aria-hidden="true" />
          <span>Search tools...</span>
          <kbd className="ml-auto flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <div className="flex items-center gap-1">
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="h-9 w-9 sm:hidden"
            aria-label="Search tools"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>
    </header>
  )
}
