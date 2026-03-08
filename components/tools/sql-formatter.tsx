"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SqlLanguage = "sql" | "mysql" | "postgresql"

// SQL keywords for formatting
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "EXISTS",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "VIEW",
  "JOIN", "INNER", "LEFT", "RIGHT", "OUTER", "FULL", "CROSS", "ON",
  "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "FETCH",
  "UNION", "ALL", "INTERSECT", "EXCEPT",
  "AS", "DISTINCT", "BETWEEN", "LIKE", "IS", "NULL",
  "CASE", "WHEN", "THEN", "ELSE", "END",
  "COUNT", "SUM", "AVG", "MIN", "MAX",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "CONSTRAINT",
  "DEFAULT", "CHECK", "UNIQUE", "CASCADE", "RESTRICT",
  "BEGIN", "COMMIT", "ROLLBACK", "TRANSACTION",
  "IF", "ELSE", "ELSEIF", "WHILE", "LOOP", "RETURN",
  "ASC", "DESC", "NULLS", "FIRST", "LAST",
  "WITH", "RECURSIVE", "OVER", "PARTITION", "ROW_NUMBER", "RANK",
  "COALESCE", "CAST", "CONVERT", "CONCAT",
  "VARCHAR", "INT", "INTEGER", "BIGINT", "SMALLINT", "FLOAT", "DOUBLE",
  "DECIMAL", "NUMERIC", "BOOLEAN", "DATE", "TIMESTAMP", "TEXT", "BLOB",
  "AUTO_INCREMENT", "SERIAL", "IDENTITY",
]

const MAJOR_CLAUSES = [
  "SELECT", "FROM", "WHERE", "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN",
  "FULL JOIN", "CROSS JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
  "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
  "UNION", "UNION ALL", "INTERSECT", "EXCEPT",
  "ON", "AND", "OR", "CASE", "WHEN", "THEN", "ELSE", "END",
  "WITH",
]

function formatSQL(sql: string): string {
  if (!sql.trim()) return ""

  // Normalize whitespace
  let formatted = sql.replace(/\s+/g, " ").trim()

  // Uppercase SQL keywords
  SQL_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi")
    formatted = formatted.replace(regex, keyword)
  })

  // Add newlines before major clauses
  const sortedClauses = [...MAJOR_CLAUSES].sort((a, b) => b.length - a.length)
  sortedClauses.forEach((clause) => {
    const regex = new RegExp(`\\s+${clause.replace(/\s/g, "\\s+")}\\b`, "gi")
    formatted = formatted.replace(regex, `\n${clause}`)
  })

  // Handle SELECT columns - add newlines after commas in SELECT
  const lines = formatted.split("\n")
  const result: string[] = []

  let inSelect = false
  let parenDepth = 0

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith("SELECT")) {
      inSelect = true
    }
    if (inSelect && (trimmedLine.startsWith("FROM") || trimmedLine.startsWith("INTO"))) {
      inSelect = false
    }

    if (inSelect && trimmedLine.startsWith("SELECT")) {
      // Split SELECT fields by commas (but not commas inside parentheses)
      const afterSelect = trimmedLine.slice(6).trim()
      const fields: string[] = []
      let current = ""
      for (const char of afterSelect) {
        if (char === "(") parenDepth++
        if (char === ")") parenDepth--
        if (char === "," && parenDepth === 0) {
          fields.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      if (current.trim()) fields.push(current.trim())

      if (fields.length > 1) {
        result.push("SELECT")
        fields.forEach((field, i) => {
          result.push(`  ${field}${i < fields.length - 1 ? "," : ""}`)
        })
      } else {
        result.push(`SELECT ${afterSelect}`)
      }
      parenDepth = 0
    } else {
      // Indent sub-clauses
      const indented = trimmedLine.startsWith("AND") || trimmedLine.startsWith("OR")
        ? `  ${trimmedLine}`
        : trimmedLine
      result.push(indented)
    }
  }

  return result.join("\n").trim()
}

function minifySQL(sql: string): string {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function SQLFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [dialect, setDialect] = useState<SqlLanguage>("sql")

  const handleFormat = () => {
    setError(null)
    if (!input.trim()) {
      setError("Please enter SQL to format")
      return
    }
    try {
      setOutput(formatSQL(input))
    } catch {
      setError("Failed to format SQL")
    }
  }

  const handleMinify = () => {
    setError(null)
    if (!input.trim()) {
      setError("Please enter SQL to minify")
      return
    }
    setOutput(minifySQL(input))
  }

  const handleUppercase = () => {
    setError(null)
    if (!input.trim()) {
      setError("Please enter SQL")
      return
    }
    let result = input
    SQL_KEYWORDS.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      result = result.replace(regex, keyword)
    })
    setOutput(result)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sampleSQL = `select u.id, u.name, u.email, o.total_amount, o.created_at from users u inner join orders o on u.id = o.user_id where u.is_active = true and o.total_amount > 100 and o.created_at >= '2024-01-01' group by u.id, u.name, u.email order by o.total_amount desc limit 50`

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SQL Formatter</CardTitle>
          <CardDescription>Format, minify, and beautify SQL queries with proper indentation and keyword uppercasing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-2">
              <Label>SQL Dialect</Label>
              <Select value={dialect} onValueChange={(v) => setDialect(v as SqlLanguage)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sql">Standard SQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleFormat}>Format</Button>
            <Button variant="outline" onClick={handleMinify}>Minify</Button>
            <Button variant="outline" onClick={handleUppercase}>Uppercase Keywords</Button>
            <Button variant="outline" size="sm" onClick={() => setInput(sampleSQL)}>Load Example</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SQL Input</Label>
              <Textarea
                placeholder="Paste your SQL query here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={16}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Formatted Output</Label>
                {output && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <Textarea
                value={output}
                readOnly
                rows={16}
                className="font-mono text-sm bg-muted"
                placeholder="Formatted SQL will appear here..."
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
