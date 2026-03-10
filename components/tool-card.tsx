"use client"

import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ToolCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tag?: "Client-side" | "Hot" | "New" | "Premium" | "Popular" | "Secure"
  category: string
}

export function ToolCard({ id, title, description, icon, tag, category }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${id}`}
      className={cn(
        "group relative flex flex-col items-start gap-4 rounded-xl border border-border bg-card/60 backdrop-blur-lg p-6 text-left transition-all duration-300 w-full",
        "hover:border-ring/30 hover:shadow-lg hover:shadow-ring/5 hover:-translate-y-1 hover:bg-card/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.98]"
      )}
      aria-label={`Open ${title} tool`}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background" aria-hidden="true">
          {icon}
        </div>
        <div className="flex gap-2 items-center">
          {tag && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                tag === "Client-side" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                tag === "Hot" && "bg-orange-500/10 text-orange-600 dark:text-orange-400",
                tag === "New" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                tag === "Premium" && "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                tag === "Popular" && "bg-pink-500/10 text-pink-600 dark:text-pink-400",
                tag === "Secure" && "bg-red-500/10 text-red-600 dark:text-red-400"
              )}
            >
              {tag}
            </span>
          )}
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Link>
  )
}
