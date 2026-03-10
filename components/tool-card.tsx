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
        "group relative flex flex-col items-start gap-4 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 text-left transition-all duration-300 w-full",
        "hover:border-black/[0.12] dark:hover:border-white/20 hover:bg-white/55 dark:hover:bg-black/50 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.98]"
      )}
      aria-label={`Open ${title} tool`}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background" aria-hidden="true">
          {icon}
        </div>
        <div className="flex gap-2 items-center">
          {tag && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                tag === "Client-side" && "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
                tag === "Hot" && "bg-orange-50 dark:bg-orange-500/15 border-orange-200/60 dark:border-orange-500/20 text-orange-700 dark:text-orange-400",
                tag === "New" && "bg-blue-50 dark:bg-blue-500/15 border-blue-200/60 dark:border-blue-500/20 text-blue-700 dark:text-blue-400",
                tag === "Premium" && "bg-violet-50 dark:bg-violet-500/15 border-violet-200/60 dark:border-violet-500/20 text-violet-700 dark:text-violet-400",
                tag === "Popular" && "bg-pink-50 dark:bg-pink-500/15 border-pink-200/60 dark:border-pink-500/20 text-pink-700 dark:text-pink-400",
                tag === "Secure" && "bg-red-50 dark:bg-red-500/15 border-red-200/60 dark:border-red-500/20 text-red-700 dark:text-red-400"
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
