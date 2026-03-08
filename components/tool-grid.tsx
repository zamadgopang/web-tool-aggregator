"use client"

import { ToolCard } from "@/components/tool-card"
import { ToolIcon } from "@/components/tool-icon"
import { tools } from "@/lib/tools"

interface ToolGridProps {
  activeCategory: string
}

export function ToolGrid({ activeCategory }: ToolGridProps) {
  const filteredTools =
    activeCategory === "all"
      ? tools
      : tools.filter((tool) => tool.category === activeCategory)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            slug={tool.slug}
            title={tool.title}
            description={tool.description}
            icon={<ToolIcon name={tool.iconName} className="h-6 w-6" />}
            tag={tool.tag}
            category={tool.category}
          />
        ))}
    </div>
  )
}
