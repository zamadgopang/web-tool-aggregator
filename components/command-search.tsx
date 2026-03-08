"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Image, FileText, FileType, Film, Code } from "lucide-react"

const tools = [
  { title: "HEIC to JPG", category: "Image Tools", icon: Image },
  { title: "WebP to PNG", category: "Image Tools", icon: Image },
  { title: "SVG to PNG", category: "Image Tools", icon: Image },
  { title: "Merge PDFs", category: "PDF Utilities", icon: FileText },
  { title: "Compress PDF", category: "PDF Utilities", icon: FileText },
  { title: "DOCX to PDF", category: "Document Converters", icon: FileType },
  { title: "CSV to Excel", category: "Document Converters", icon: FileType },
  { title: "Video to GIF", category: "Media", icon: Film },
]

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
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

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools..." />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading="Tools">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <CommandItem key={tool.title} className="flex items-center gap-3 cursor-pointer">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>{tool.title}</span>
                  <span className="text-xs text-muted-foreground">{tool.category}</span>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
