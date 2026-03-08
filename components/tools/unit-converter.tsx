"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle } from "lucide-react"

type UnitCategory = "length" | "weight" | "temperature" | "volume" | "speed"

const unitCategories = {
  length: {
    name: "Length",
    units: {
      mm: { name: "Millimeter", toBase: (v: number) => v / 1000 },
      cm: { name: "Centimeter", toBase: (v: number) => v / 100 },
      m: { name: "Meter", toBase: (v: number) => v },
      km: { name: "Kilometer", toBase: (v: number) => v * 1000 },
      in: { name: "Inch", toBase: (v: number) => v * 0.0254 },
      ft: { name: "Foot", toBase: (v: number) => v * 0.3048 },
      mi: { name: "Mile", toBase: (v: number) => v * 1609.34 },
    },
  },
  weight: {
    name: "Weight",
    units: {
      mg: { name: "Milligram", toBase: (v: number) => v / 1000000 },
      g: { name: "Gram", toBase: (v: number) => v / 1000 },
      kg: { name: "Kilogram", toBase: (v: number) => v },
      oz: { name: "Ounce", toBase: (v: number) => v * 0.0283495 },
      lb: { name: "Pound", toBase: (v: number) => v * 0.453592 },
      t: { name: "Metric Ton", toBase: (v: number) => v * 1000 },
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      C: { name: "Celsius", toBase: (v: number) => v },
      F: { name: "Fahrenheit", toBase: (v: number) => (v - 32) * (5 / 9) },
      K: { name: "Kelvin", toBase: (v: number) => v - 273.15 },
    },
  },
  volume: {
    name: "Volume",
    units: {
      ml: { name: "Milliliter", toBase: (v: number) => v / 1000 },
      l: { name: "Liter", toBase: (v: number) => v },
      fl_oz: { name: "Fluid Ounce", toBase: (v: number) => v * 0.0295735 },
      cup: { name: "Cup", toBase: (v: number) => v * 0.236588 },
      pint: { name: "Pint", toBase: (v: number) => v * 0.473176 },
      gal: { name: "Gallon", toBase: (v: number) => v * 3.78541 },
    },
  },
  speed: {
    name: "Speed",
    units: {
      mps: { name: "Meter/Second", toBase: (v: number) => v },
      kmh: { name: "Kilometer/Hour", toBase: (v: number) => v / 3.6 },
      mph: { name: "Mile/Hour", toBase: (v: number) => v * 0.44704 },
      knot: { name: "Knot", toBase: (v: number) => v * 0.51444 },
    },
  },
}

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length")
  const [inputValue, setInputValue] = useState("1")
  const [fromUnit, setFromUnit] = useState("m")
  const [toUnit, setToUnit] = useState("km")
  const [copied, setCopied] = useState<string | null>(null)

  const currentCategory = unitCategories[category]
  const categoryUnits = Object.entries(currentCategory.units)

  const calculate = () => {
    const value = parseFloat(inputValue) || 0
    const fromUnitData = currentCategory.units[fromUnit as keyof typeof currentCategory.units]
    const toUnitData = currentCategory.units[toUnit as keyof typeof currentCategory.units]

    if (!fromUnitData || !toUnitData) return "0"

    const baseValue = fromUnitData.toBase(value)
    // Convert from base back to target unit
    const targetValue = category === "temperature" 
      ? (baseValue + 273.15 - 273.15 + (toUnit === "F" ? 32 + baseValue * (9/5) : toUnit === "K" ? 273.15 + baseValue : baseValue))
      : baseValue / toUnitData.toBase(1)

    return targetValue.toFixed(6).replace(/\.?0+$/, "")
  }

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 2000)
  }

  const result = calculate()

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unit Converter</CardTitle>
          <CardDescription>Convert between different measurement units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(Object.keys(unitCategories) as UnitCategory[]).map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCategory(cat)
                    const units = Object.keys(unitCategories[cat].units)
                    setFromUnit(units[0])
                    setToUnit(units[1])
                  }}
                  className="capitalize"
                >
                  {unitCategories[cat].name}
                </Button>
              ))}
            </div>
          </div>

          {/* Conversion Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Unit */}
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full p-2 border rounded-lg bg-background text-foreground"
              >
                {categoryUnits.map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name} ({key})
                  </option>
                ))}
              </select>
            </div>

            {/* To Unit */}
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                type="text"
                value={result}
                readOnly
                className="bg-muted"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full p-2 border rounded-lg bg-background text-foreground"
              >
                {categoryUnits.map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name} ({key})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Copy Result Button */}
          {result && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleCopy(result)}
            >
              {copied === result ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result: {result}
                </>
              )}
            </Button>
          )}

          {/* Common Conversions */}
          <div className="p-3 bg-muted rounded-lg text-sm">
            <strong>Quick Reference:</strong>
            <div className="mt-2 space-y-1 text-muted-foreground text-xs">
              {category === "length" && (
                <>
                  <div>1 m = 3.28084 ft</div>
                  <div>1 km = 0.621371 mi</div>
                </>
              )}
              {category === "weight" && (
                <>
                  <div>1 kg = 2.20462 lb</div>
                  <div>1 kg = 35.274 oz</div>
                </>
              )}
              {category === "temperature" && (
                <>
                  <div>0°C = 32°F</div>
                  <div>-40°C = -40°F</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
