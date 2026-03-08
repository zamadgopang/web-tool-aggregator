"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, CheckCircle } from "lucide-react"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState<"weak" | "medium" | "strong" | "very-strong">("strong")

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let chars = ""
    if (includeUppercase) chars += uppercase
    if (includeLowercase) chars += lowercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    if (!chars) {
      alert("Please select at least one character type")
      return
    }

    let newPassword = ""
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(newPassword)

    // Calculate strength
    let strengthScore = 0
    if (includeUppercase) strengthScore++
    if (includeLowercase) strengthScore++
    if (includeNumbers) strengthScore++
    if (includeSymbols) strengthScore++
    if (length > 12) strengthScore++
    if (length > 16) strengthScore++

    if (strengthScore <= 2) {
      setStrength("weak")
    } else if (strengthScore <= 3) {
      setStrength("medium")
    } else if (strengthScore <= 4) {
      setStrength("strong")
    } else {
      setStrength("very-strong")
    }
  }

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  React.useEffect(() => {
    generatePassword()
  }, [])

  const strengthColors = {
    weak: "text-red-600",
    medium: "text-orange-600",
    strong: "text-blue-600",
    "very-strong": "text-green-600",
  }

  const strengthLabels = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    "very-strong": "Very Strong",
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>Generate secure, random passwords with custom options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generated Password Display */}
          <div className="space-y-2">
            <Label>Generated Password</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={password}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                size="lg"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Strength:</span>
            <span className={`text-sm font-medium ${strengthColors[strength]}`}>
              {strengthLabels[strength]}
            </span>
          </div>

          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Length</Label>
              <span className="text-sm font-medium text-muted-foreground">{length} characters</span>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={8}
              max={64}
              step={1}
              className="w-full"
            />
          </div>

          {/* Character Type Checkboxes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Character Types</Label>
            <div className="space-y-2">
              {[
                {
                  label: "Uppercase (A-Z)",
                  value: includeUppercase,
                  onChange: setIncludeUppercase,
                },
                {
                  label: "Lowercase (a-z)",
                  value: includeLowercase,
                  onChange: setIncludeLowercase,
                },
                {
                  label: "Numbers (0-9)",
                  value: includeNumbers,
                  onChange: setIncludeNumbers,
                },
                {
                  label: "Symbols (!@#$%..)",
                  value: includeSymbols,
                  onChange: setIncludeSymbols,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.label}
                    checked={item.value}
                    onCheckedChange={(checked) => item.onChange(checked as boolean)}
                  />
                  <Label htmlFor={item.label} className="font-normal cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={generatePassword} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
