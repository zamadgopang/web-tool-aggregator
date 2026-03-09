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
    <div className="flex flex-wrap gap-2 p-1 bg-secondary/50 rounded-xl w-fit" role="tablist" aria-label="Filter tools by category">
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
