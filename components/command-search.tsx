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
import { tools as allTools } from "@/lib/tools-data"
import { Image, Code, Zap, Shield, Hash, QrCode, Palette, Calculator, FileCode, TextIcon, Link, Regex, AlignLeft, KeyRound, Clock, Fingerprint, Braces, FileJson, Timer, Paintbrush, Database, Code2, Crop, Globe, Square, Terminal, Ratio, Droplets } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Image, Code, Zap, Shield, Hash, QrCode, Palette, Calculator, FileCode, TextIcon, Link, Regex, AlignLeft, KeyRound, Clock, Fingerprint, Braces, FileJson, Timer, Paintbrush, Database, Code2, Crop, Globe, Square, Terminal, Ratio, Droplets,
}

const categoryLabels: Record<string, string> = {
  developer: "Developer Tools",
  image: "Image Tools",
  text: "Text Tools",
  utility: "Utilities",
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

  const handleSelect = (toolId: string) => {
    router.push(`/tools/${toolId}`)
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools..." aria-label="Search tools" />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading="Tools">
          {allTools.map((tool) => {
            const Icon = iconMap[tool.iconName] || Code
            return (
              <CommandItem
                key={tool.id}
                className="flex items-center gap-3 cursor-pointer"
                onSelect={() => handleSelect(tool.id)}
                value={`${tool.title} ${tool.description}`}
              >
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="flex flex-col">
                  <span>{tool.title}</span>
                  <span className="text-xs text-muted-foreground">{categoryLabels[tool.category] || tool.category}</span>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
