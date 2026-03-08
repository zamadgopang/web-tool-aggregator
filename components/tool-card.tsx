"use client"

import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  tag?: "Client-side" | "Hot" | "New"
  category: string
}

export function ToolCard({ title, description, icon, tag }: ToolCardProps) {
  return (
    <button
      className={cn(
        "group relative flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 text-left transition-all duration-200",
        "hover:border-muted-foreground/30 hover:bg-secondary/50 hover:shadow-lg hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          {icon}
        </div>
        {tag && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              tag === "Client-side" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              tag === "Hot" && "bg-orange-500/10 text-orange-600 dark:text-orange-400",
              tag === "New" && "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            )}
          >
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </button>
  )
}
