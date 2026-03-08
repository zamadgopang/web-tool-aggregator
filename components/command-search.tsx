"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { tools } from "@/lib/tools"
import { ToolIcon } from "@/components/tool-icon"

const categoryLabels: Record<string, string> = {
  image: "Image Tools",
  pdf: "PDF Utilities",
  document: "Document Converters",
  media: "Media",
  developer: "Developer Tools",
}

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const handleSelect = (slug: string) => {
    onOpenChange(false)
    router.push(`/${slug}`)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools..." />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading="Tools">
          {tools.map((tool) => (
              <CommandItem 
                key={tool.id} 
                value={tool.title}
                onSelect={() => handleSelect(tool.slug)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <ToolIcon name={tool.iconName} className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>{tool.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {categoryLabels[tool.category] || tool.category}
                  </span>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
