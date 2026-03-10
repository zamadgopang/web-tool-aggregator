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
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]" role="banner">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="ZamDev Tools — Go to homepage">
            {mounted && (
              <img
                src={theme === "dark" ? "/ZamDev_Dark_logo.png" : "/ZamDev_light_logo.png"}
                alt="ZamDev Logo"
                className="h-8 w-auto"
              />
            )}
            <span className="text-xl font-bold text-foreground">Tools</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            by{" "}
            <a
              href="https://zamdev.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline"
            >
              ZamDev
            </a>
          </span>
        </div>

        {/* Desktop search bar */}
        <button
          onClick={onSearchClick}
          aria-label="Search tools (Ctrl+K)"
          className="hidden sm:flex items-center gap-3 rounded-xl border border-black/[0.06] dark:border-white/20 bg-white/60 dark:bg-white/10 backdrop-blur-md shadow-sm px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-white/70 dark:hover:bg-white/15 hover:text-foreground hover:shadow-md w-72"
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
