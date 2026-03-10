"use client"

import { cn } from "@/lib/utils"

export function SkeletonCard() {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6",
        "animate-pulse"
      )}
      aria-hidden="true"
    >
      <div className="flex w-full items-start justify-between">
        <div className="h-12 w-12 rounded-lg bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="status"
      aria-label="Loading tools"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      <span className="sr-only">Loading tools...</span>
    </div>
  )
}
