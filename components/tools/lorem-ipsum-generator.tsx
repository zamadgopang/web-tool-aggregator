"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, CheckCircle, RefreshCw } from "lucide-react"

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam",
  "tempora", "incidunt", "magnam", "aliquam", "quaerat",
]

type GenerateType = "paragraphs" | "sentences" | "words"

function generateWord(): string {
  const randomValues = new Uint32Array(1)
  crypto.getRandomValues(randomValues)
  return LOREM_WORDS[randomValues[0] % LOREM_WORDS.length]
}

function generateSentence(minWords: number = 8, maxWords: number = 16): string {
  const randomValues = new Uint32Array(1)
  crypto.getRandomValues(randomValues)
  const wordCount = minWords + (randomValues[0] % (maxWords - minWords + 1))
  const words = Array.from({ length: wordCount }, () => generateWord())
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(" ") + "."
}

function generateParagraph(minSentences: number = 3, maxSentences: number = 7): string {
  const randomValues = new Uint32Array(1)
  crypto.getRandomValues(randomValues)
  const sentenceCount = minSentences + (randomValues[0] % (maxSentences - minSentences + 1))
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ")
}

export function LoremIpsumGenerator() {
  const [count, setCount] = useState(3)
  const [type, setType] = useState<GenerateType>("paragraphs")
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    let result = ""

    switch (type) {
      case "paragraphs":
        result = Array.from({ length: count }, () => generateParagraph()).join("\n\n")
        break
      case "sentences":
        result = Array.from({ length: count }, () => generateSentence()).join(" ")
        break
      case "words":
        result = Array.from({ length: count }, () => generateWord()).join(" ")
        // Capitalize first word
        result = result.charAt(0).toUpperCase() + result.slice(1)
        break
    }

    if (startWithLorem) {
      const loremStart = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
      if (type === "words") {
        const words = result.split(" ")
        const loremWords = loremStart.replace(/[.,]/g, "").trim().split(" ")
        for (let i = 0; i < Math.min(loremWords.length, words.length); i++) {
          words[i] = loremWords[i]
        }
        result = words.join(" ")
      } else {
        result = loremStart + result.slice(result.indexOf(" ") + 1)
      }
    }

    setOutput(result)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = output ? output.trim().split(/\s+/).length : 0
  const charCount = output.length

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lorem Ipsum Generator</CardTitle>
          <CardDescription>Generate placeholder text for your designs and layouts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Generate</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["paragraphs", "sentences", "words"] as const).map((t) => (
                <Button
                  key={t}
                  variant={type === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType(t)}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Count Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Count</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {count} {type}
              </span>
            </div>
            <Slider
              value={[count]}
              onValueChange={(v) => setCount(v[0])}
              min={1}
              max={type === "words" ? 100 : type === "sentences" ? 20 : 10}
              step={1}
              className="w-full"
              aria-label={`Number of ${type}`}
            />
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="start-lorem"
              checked={startWithLorem}
              onCheckedChange={(checked) => setStartWithLorem(checked as boolean)}
            />
            <Label htmlFor="start-lorem" className="cursor-pointer text-sm">
              Start with &quot;Lorem ipsum dolor sit amet...&quot;
            </Label>
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerate} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Text
          </Button>

          {/* Output */}
          {output && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Generated Text</Label>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span>{charCount} chars</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50 max-h-80 overflow-auto text-sm leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
              <Button onClick={handleCopy} variant="outline" className="w-full">
                {copied ? (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Copied!</>
                ) : (
                  <><Copy className="h-4 w-4 mr-2" /> Copy Text</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
