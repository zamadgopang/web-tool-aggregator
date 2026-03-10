"use client"

import { cn } from "@/lib/utils"
import { Image, Code, LayoutGrid, Zap, Wrench } from "lucide-react"

const categories = [
  { id: "all", label: "All Tools", icon: LayoutGrid },
  { id: "image", label: "Image", icon: Image },
  { id: "developer", label: "Developer", icon: Code },
  { id: "text", label: "Text", icon: Zap },
  { id: "utility", label: "Utilities", icon: Wrench },
]

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1.5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl dark:backdrop-blur-2xl backdrop-saturate-150 dark:backdrop-saturate-150 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl w-fit" role="tablist" aria-label="Filter tools by category">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            role="tab"
            aria-selected={activeCategory === category.id}
            aria-label={`Show ${category.label}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === category.id
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
