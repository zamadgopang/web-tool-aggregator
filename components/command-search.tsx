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
import { Image, Code, Zap, Shield, Hash, QrCode, Palette, Calculator, FileCode, TextIcon, Link, Regex, AlignLeft } from "lucide-react"

const toolMap: Record<string, string> = {
  "Image Converter": "image-converter",
  "JSON Formatter": "json-formatter",
  "Regex Tester": "regex-tester",
  "Markdown Preview": "markdown-preview",
  "Text Minifier": "text-minifier",
  "Base64 Converter": "base64-converter",
  "URL Encoder/Decoder": "url-encoder-decoder",
  "Text Diff Checker": "text-diff-checker",
  "Lorem Ipsum Generator": "lorem-ipsum-generator",
  "Password Generator": "password-generator",
  "Hash Generator": "hash-generator",
  "QR Code Generator": "qr-code-generator",
  "Color Converter": "color-converter",
  "Unit Converter": "unit-converter",
}

const tools = [
  // Image Tools
  { title: "Image Converter", category: "Image Tools", icon: Image },
  
  // Developer Tools
  { title: "JSON Formatter", category: "Developer Tools", icon: Code },
  { title: "Regex Tester", category: "Developer Tools", icon: Regex },
  { title: "Markdown Preview", category: "Developer Tools", icon: FileCode },
  
  // Text Tools
  { title: "Text Minifier", category: "Text Tools", icon: Zap },
  { title: "Base64 Converter", category: "Text Tools", icon: Shield },
  { title: "URL Encoder/Decoder", category: "Text Tools", icon: Link },
  { title: "Text Diff Checker", category: "Text Tools", icon: AlignLeft },
  { title: "Lorem Ipsum Generator", category: "Text Tools", icon: TextIcon },
  
  // Utility Tools
  { title: "Password Generator", category: "Security", icon: Shield },
  { title: "Hash Generator", category: "Security", icon: Hash },
  { title: "QR Code Generator", category: "Utilities", icon: QrCode },
  { title: "Color Converter", category: "Utilities", icon: Palette },
  { title: "Unit Converter", category: "Utilities", icon: Calculator },
]

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onToolSelect?: (toolId: string) => void
}

export function CommandSearch({ open, onOpenChange, onToolSelect }: CommandSearchProps) {
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

  const handleSelect = (toolTitle: string) => {
    const toolId = toolMap[toolTitle]
    if (toolId && onToolSelect) {
      onToolSelect(toolId)
      onOpenChange(false)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools..." />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading="Tools">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <CommandItem
                key={tool.title}
                className="flex items-center gap-3 cursor-pointer"
                onSelect={() => handleSelect(tool.title)}
              >
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
