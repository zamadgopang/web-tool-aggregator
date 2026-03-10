"use client"

import React, { useState, useMemo } from "react"
import DOMPurify from "dompurify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, Eye, Code } from "lucide-react"

const defaultMarkdown = `# Welcome to Markdown Preview

## Features
- **Bold text** and *italic text*
- ~~Strikethrough~~ text
- [Links](https://example.com)
- Inline \`code\` blocks

## Code Block
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Lists
1. First item
2. Second item
3. Third item

- Unordered item
- Another item

## Blockquote
> This is a blockquote.
> It can span multiple lines.

## Table
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

---

*Start editing to see live preview!*
`

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML entities first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  // Code blocks (before other transformations)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre class="md-code-block"><code class="language-${lang}">${code.trim()}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="md-h6">$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="md-h5">$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="md-h4">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="md-h1">$1</h1>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="md-hr" />')

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>")

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="md-link" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="md-img" />'
  )

  // Blockquotes
  html = html.replace(
    /^&gt;\s+(.+)$/gm,
    '<blockquote class="md-blockquote">$1</blockquote>'
  )

  // Tables
  html = html.replace(
    /^\|(.+)\|\s*\n\|[-|\s]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm,
    (_match, header, body) => {
      const headers = header
        .split("|")
        .map((h: string) => h.trim())
        .filter(Boolean)
        .map((h: string) => `<th class="md-th">${h}</th>`)
        .join("")
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .map((c: string) => c.trim())
            .filter(Boolean)
            .map((c: string) => `<td class="md-td">${c}</td>`)
            .join("")
          return `<tr>${cells}</tr>`
        })
        .join("")
      return `<table class="md-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
    }
  )

  // Ordered lists
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="md-oli">$2</li>')
  html = html.replace(
    /(<li class="md-oli">.*<\/li>\n?)+/g,
    (match) => `<ol class="md-ol">${match}</ol>`
  )

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="md-uli">$1</li>')
  html = html.replace(
    /(<li class="md-uli">.*<\/li>\n?)+/g,
    (match) => `<ul class="md-ul">${match}</ul>`
  )

  // Paragraphs (lines that aren't already wrapped)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<table") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr")
      ) {
        return trimmed
      }
      return `<p class="md-p">${trimmed.replace(/\n/g, "<br />")}</p>`
    })
    .join("\n")

  return html
}

export function MarkdownPreview() {
  const [input, setInput] = useState(defaultMarkdown)
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<"split" | "preview" | "editor">("split")

  const renderedHTML = useMemo(() => {
    const rawHtml = parseMarkdown(input)
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','hr','strong','em','del','a','img','pre','code','blockquote','ul','ol','li','table','thead','tbody','tr','th','td','mark','span','div'],
      ALLOWED_ATTR: ['class','href','src','alt','target','rel','style'],
      ALLOW_DATA_ATTR: false,
    })
  }, [input])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Markdown Preview</CardTitle>
              <CardDescription>Write markdown and see live preview</CardDescription>
            </div>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={view === "editor" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("editor")}
              >
                <Code className="h-4 w-4 mr-1" />
                Editor
              </Button>
              <Button
                variant={view === "split" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("split")}
              >
                Split
              </Button>
              <Button
                variant={view === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("preview")}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="p-2 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Characters</p>
              <p className="font-mono font-semibold">{input.length}</p>
            </div>
            <div className="p-2 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Words</p>
              <p className="font-mono font-semibold">{input.trim() ? input.trim().split(/\s+/).length : 0}</p>
            </div>
            <div className="p-2 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Lines</p>
              <p className="font-mono font-semibold">{input.split("\n").length}</p>
            </div>
          </div>

          <div className={`grid gap-4 ${view === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* Editor */}
            {(view === "split" || view === "editor") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Markdown</Label>
                  <span className="text-xs text-muted-foreground">{input.length} chars</span>
                </div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write markdown here..."
                  className="min-h-[500px] font-mono text-sm resize-none"
                />
              </div>
            )}

            {/* Preview */}
            {(view === "split" || view === "preview") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preview</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(renderedHTML)}
                    >
                      {copied ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3 mr-1" /> HTML</>
                      )}
                    </Button>
                  </div>
                </div>
                <div
                  className="min-h-[500px] p-4 border rounded-lg bg-background overflow-auto prose-custom"
                  dangerouslySetInnerHTML={{ __html: renderedHTML }}
                  style={{
                    // Inline styles for markdown rendering
                    lineHeight: "1.7",
                  }}
                />
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      <style jsx>{`
        .prose-custom :global(h1.md-h1) { font-size: 2em; font-weight: 700; margin: 0.67em 0; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.3em; }
        .prose-custom :global(h2.md-h2) { font-size: 1.5em; font-weight: 600; margin: 0.83em 0; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.3em; }
        .prose-custom :global(h3.md-h3) { font-size: 1.25em; font-weight: 600; margin: 1em 0; }
        .prose-custom :global(h4.md-h4) { font-size: 1em; font-weight: 600; margin: 1em 0; }
        .prose-custom :global(h5.md-h5) { font-size: 0.875em; font-weight: 600; margin: 1em 0; }
        .prose-custom :global(h6.md-h6) { font-size: 0.85em; font-weight: 600; margin: 1em 0; color: hsl(var(--muted-foreground)); }
        .prose-custom :global(p.md-p) { margin: 0.5em 0; }
        .prose-custom :global(a.md-link) { color: hsl(var(--primary)); text-decoration: underline; }
        .prose-custom :global(strong) { font-weight: 700; }
        .prose-custom :global(em) { font-style: italic; }
        .prose-custom :global(del) { text-decoration: line-through; }
        .prose-custom :global(pre.md-code-block) { background: hsl(var(--muted)); padding: 1em; border-radius: 0.5em; overflow-x: auto; margin: 1em 0; }
        .prose-custom :global(code.md-inline-code) { background: hsl(var(--muted)); padding: 0.2em 0.4em; border-radius: 0.25em; font-size: 0.875em; font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', 'SF Mono', ui-monospace, monospace; }
        .prose-custom :global(pre.md-code-block code) { font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', 'SF Mono', ui-monospace, monospace; font-size: 0.875em; }
        .prose-custom :global(blockquote.md-blockquote) { border-left: 4px solid hsl(var(--border)); padding: 0.5em 1em; margin: 1em 0; color: hsl(var(--muted-foreground)); }
        .prose-custom :global(ul.md-ul) { list-style-type: disc; padding-left: 2em; margin: 0.5em 0; }
        .prose-custom :global(ol.md-ol) { list-style-type: decimal; padding-left: 2em; margin: 0.5em 0; }
        .prose-custom :global(li.md-uli), .prose-custom :global(li.md-oli) { margin: 0.25em 0; }
        .prose-custom :global(hr.md-hr) { border: none; border-top: 1px solid hsl(var(--border)); margin: 2em 0; }
        .prose-custom :global(table.md-table) { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .prose-custom :global(th.md-th) { border: 1px solid hsl(var(--border)); padding: 0.5em; background: hsl(var(--muted)); font-weight: 600; text-align: left; }
        .prose-custom :global(td.md-td) { border: 1px solid hsl(var(--border)); padding: 0.5em; }
        .prose-custom :global(img.md-img) { max-width: 100%; border-radius: 0.5em; }
      `}</style>
    </div>
  )
}
