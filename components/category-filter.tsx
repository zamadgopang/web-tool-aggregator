"use client"

import { cn } from "@/lib/utils"
import { Image, FileText, FileType, Code, Film, LayoutGrid } from "lucide-react"

const categories = [
  { id: "all", label: "All Tools", icon: LayoutGrid },
  { id: "image", label: "Image Tools", icon: Image },
  { id: "pdf", label: "PDF Utilities", icon: FileText },
  { id: "document", label: "Document Converters", icon: FileType },
  { id: "developer", label: "Developer", icon: Code },
  { id: "media", label: "Media", icon: Film },
]

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === category.id
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
