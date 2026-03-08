"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

type PermissionTriple = [boolean, boolean, boolean] // read, write, execute

export function ChmodCalculator() {
  const [owner, setOwner] = useState<PermissionTriple>([true, true, true])
  const [group, setGroup] = useState<PermissionTriple>([true, false, true])
  const [others, setOthers] = useState<PermissionTriple>([true, false, true])
  const [copied, setCopied] = useState<string | null>(null)

  const tripleToOctal = (triple: PermissionTriple): number => {
    return (triple[0] ? 4 : 0) + (triple[1] ? 2 : 0) + (triple[2] ? 1 : 0)
  }

  const tripleToSymbolic = (triple: PermissionTriple): string => {
    return (triple[0] ? "r" : "-") + (triple[1] ? "w" : "-") + (triple[2] ? "x" : "-")
  }

  const octalValue = `${tripleToOctal(owner)}${tripleToOctal(group)}${tripleToOctal(others)}`
  const symbolicValue = `${tripleToSymbolic(owner)}${tripleToSymbolic(group)}${tripleToSymbolic(others)}`
  const chmodCommand = `chmod ${octalValue} <file>`
  const chmodSymbolic = `chmod u=${tripleToSymbolic(owner).replace(/-/g, "")},g=${tripleToSymbolic(group).replace(/-/g, "")},o=${tripleToSymbolic(others).replace(/-/g, "")} <file>`

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const setFromOctal = (val: string) => {
    if (val.length !== 3) return
    const digits = val.split("").map(Number)
    if (digits.some((d) => isNaN(d) || d < 0 || d > 7)) return

    const toTriple = (n: number): PermissionTriple => [!!(n & 4), !!(n & 2), !!(n & 1)]
    setOwner(toTriple(digits[0]))
    setGroup(toTriple(digits[1]))
    setOthers(toTriple(digits[2]))
  }

  const commonPermissions = [
    { label: "755", desc: "Owner: rwx, Group: r-x, Others: r-x (common for directories)" },
    { label: "644", desc: "Owner: rw-, Group: r--, Others: r-- (common for files)" },
    { label: "777", desc: "Owner: rwx, Group: rwx, Others: rwx (full access)" },
    { label: "700", desc: "Owner: rwx, Group: ---, Others: --- (owner only)" },
    { label: "600", desc: "Owner: rw-, Group: ---, Others: --- (private files)" },
    { label: "664", desc: "Owner: rw-, Group: rw-, Others: r-- (group writable)" },
    { label: "750", desc: "Owner: rwx, Group: r-x, Others: --- (restricted)" },
    { label: "400", desc: "Owner: r--, Group: ---, Others: --- (read-only, owner)" },
  ]

  const permLabels = ["Read (r)", "Write (w)", "Execute (x)"]

  const renderPermGroup = (
    label: string,
    triple: PermissionTriple,
    setTriple: (t: PermissionTriple) => void
  ) => (
    <div className="space-y-3 p-4 border rounded-lg">
      <Label className="font-semibold">{label}</Label>
      <div className="flex flex-col gap-2">
        {permLabels.map((perm, i) => (
          <div key={perm} className="flex items-center gap-2">
            <Checkbox
              checked={triple[i]}
              onCheckedChange={(checked) => {
                const newTriple = [...triple] as PermissionTriple
                newTriple[i] = !!checked
                setTriple(newTriple)
              }}
            />
            <Label className="text-sm font-normal cursor-pointer">{perm}</Label>
          </div>
        ))}
      </div>
      <div className="text-center">
        <span className="font-mono text-2xl font-bold">{tripleToOctal(triple)}</span>
        <p className="font-mono text-sm text-muted-foreground">{tripleToSymbolic(triple)}</p>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chmod Calculator</CardTitle>
          <CardDescription>Calculate Unix/Linux file permissions in numeric and symbolic notation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderPermGroup("Owner (u)", owner, setOwner)}
            {renderPermGroup("Group (g)", group, setGroup)}
            {renderPermGroup("Others (o)", others, setOthers)}
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg space-y-1">
              <Label className="text-xs text-muted-foreground">Numeric (Octal)</Label>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono font-bold">{octalValue}</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(octalValue, "octal")}>
                  {copied === "octal" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-1">
              <Label className="text-xs text-muted-foreground">Symbolic</Label>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono font-bold">-{symbolicValue}</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(symbolicValue, "symbolic")}>
                  {copied === "symbolic" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Commands */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Commands</Label>
            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
              <code className="text-sm font-mono">{chmodCommand}</code>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chmodCommand, "cmd")}>
                {copied === "cmd" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
              <code className="text-sm font-mono">{chmodSymbolic}</code>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chmodSymbolic, "symcmd")}>
                {copied === "symcmd" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Common Permissions */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Common Permissions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {commonPermissions.map((perm) => (
                <button
                  key={perm.label}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    octalValue === perm.label ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"
                  }`}
                  onClick={() => setFromOctal(perm.label)}
                >
                  <span className={`font-mono font-bold text-lg w-10 ${octalValue === perm.label ? "text-primary-foreground" : ""}`}>{perm.label}</span>
                  <span className={`text-xs ${octalValue === perm.label ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{perm.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
