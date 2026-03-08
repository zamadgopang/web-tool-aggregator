"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MetaTagGenerator() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [siteName, setSiteName] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [ogType, setOgType] = useState("website")
  const [twitterCardType, setTwitterCardType] = useState("summary_large_image")
  const [robots, setRobots] = useState("index, follow")
  const [themeColor, setThemeColor] = useState("#000000")
  const [copied, setCopied] = useState(false)

  const generateMeta = (): string => {
    const tags: string[] = []

    // Basic Meta Tags
    tags.push("<!-- Primary Meta Tags -->")
    if (title) tags.push(`<title>${escapeHtml(title)}</title>`)
    if (title) tags.push(`<meta name="title" content="${escapeHtml(title)}" />`)
    if (description) tags.push(`<meta name="description" content="${escapeHtml(description)}" />`)
    if (keywords) tags.push(`<meta name="keywords" content="${escapeHtml(keywords)}" />`)
    if (author) tags.push(`<meta name="author" content="${escapeHtml(author)}" />`)
    if (robots) tags.push(`<meta name="robots" content="${escapeHtml(robots)}" />`)
    if (themeColor) tags.push(`<meta name="theme-color" content="${escapeHtml(themeColor)}" />`)

    // Viewport
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`)
    tags.push(`<meta charset="UTF-8" />`)

    // Open Graph
    tags.push("")
    tags.push("<!-- Open Graph / Facebook -->")
    tags.push(`<meta property="og:type" content="${escapeHtml(ogType)}" />`)
    if (url) tags.push(`<meta property="og:url" content="${escapeHtml(url)}" />`)
    if (title) tags.push(`<meta property="og:title" content="${escapeHtml(title)}" />`)
    if (description) tags.push(`<meta property="og:description" content="${escapeHtml(description)}" />`)
    if (imageUrl) tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}" />`)
    if (siteName) tags.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}" />`)

    // Twitter Card
    tags.push("")
    tags.push("<!-- Twitter -->")
    tags.push(`<meta property="twitter:card" content="${escapeHtml(twitterCardType)}" />`)
    if (url) tags.push(`<meta property="twitter:url" content="${escapeHtml(url)}" />`)
    if (title) tags.push(`<meta property="twitter:title" content="${escapeHtml(title)}" />`)
    if (description) tags.push(`<meta property="twitter:description" content="${escapeHtml(description)}" />`)
    if (imageUrl) tags.push(`<meta property="twitter:image" content="${escapeHtml(imageUrl)}" />`)
    if (twitterHandle) tags.push(`<meta property="twitter:creator" content="${escapeHtml(twitterHandle)}" />`)

    return tags.join("\n")
  }

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }

  const output = generateMeta()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tag & Open Graph Generator</CardTitle>
          <CardDescription>Generate SEO meta tags, Open Graph, and Twitter Card markup with live preview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Website"
                  maxLength={60}
                />
                <span className="text-xs text-muted-foreground">{title.length}/60 characters</span>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your page for search engines..."
                  maxLength={160}
                  rows={3}
                />
                <span className="text-xs text-muted-foreground">{description.length}/160 characters</span>
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="web, tools, converter, developer"
                />
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label>Page URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                />
              </div>

              <div className="space-y-2">
                <Label>Image URL (for social sharing)</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                />
              </div>

              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="My Website"
                />
              </div>

              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <Input
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>OG Type</Label>
                  <Select value={ogType} onValueChange={setOgType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Twitter Card</Label>
                  <Select value={twitterCardType} onValueChange={setTwitterCardType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                      <SelectItem value="app">App</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Robots</Label>
                  <Select value={robots} onValueChange={setRobots}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index, follow">Index, Follow</SelectItem>
                      <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                      <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                      <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Theme Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border"
                    />
                    <Input
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-4">
              {/* Google Preview */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Google Search Preview</Label>
                <div className="border rounded-lg p-4 bg-white dark:bg-zinc-900 space-y-1">
                  <p className="text-blue-600 dark:text-blue-400 text-lg leading-tight truncate">
                    {title || "Page Title"}
                  </p>
                  <p className="text-green-700 dark:text-green-500 text-sm truncate">
                    {url || "https://example.com/page"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description || "Page description will appear here..."}
                  </p>
                </div>
              </div>

              {/* Social Preview */}
              {(title || imageUrl) && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Social Share Preview</Label>
                  <div className="border rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                    {imageUrl && (
                      <div className="bg-muted h-32 flex items-center justify-center text-xs text-muted-foreground">
                        Image: {imageUrl}
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <p className="text-xs text-muted-foreground uppercase">{siteName || url || "example.com"}</p>
                      <p className="font-semibold text-sm">{title || "Page Title"}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Generated HTML</Label>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  value={output}
                  readOnly
                  rows={20}
                  className="font-mono text-xs bg-muted"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
