"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Zap, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tool } from "@/lib/tools"

interface ToolPageLayoutProps {
  tool: Tool
  children: React.ReactNode
}

export function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const Icon = tool.icon

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to all tools
        </Link>

        {/* Tool header */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  {tool.title}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    tool.tag === "Client-side" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    tool.tag === "Hot" && "bg-orange-500/10 text-orange-600 dark:text-orange-400",
                    tool.tag === "New" && "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  )}
                >
                  {tool.tag}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {tool.longDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Main tool interface */}
        <div className="mb-8">
          {children}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-border pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Instant Processing</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-blue-500" />
            <span>No Upload Required</span>
          </div>
        </div>
      </div>
    </div>
  )
}
