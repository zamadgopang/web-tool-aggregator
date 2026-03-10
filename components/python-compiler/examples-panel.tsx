"use client"

import { useState } from "react"
import { Code2, ChevronDown, ChevronRight, Sparkles, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Example {
  id: string
  title: string
  description: string
  code: string
}

interface ExampleCategory {
  id: string
  name: string
  icon: React.ReactNode
  examples: Example[]
}

const exampleCategories: ExampleCategory[] = [
  {
    id: "basics",
    name: "Basics",
    icon: <BookOpen className="w-4 h-4" />,
    examples: [
      {
        id: "hello-world",
        title: "Hello World",
        description: "Classic first program",
        code: `# Hello World - Your first Python program
print("Hello, World!")
print("Welcome to Python programming!")`,
      },
      {
        id: "variables",
        title: "Variables & Types",
        description: "Working with data types",
        code: `# Variables and Data Types
name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"Name: {name} (type: {type(name).__name__})")
print(f"Age: {age} (type: {type(age).__name__})")
print(f"Height: {height} (type: {type(height).__name__})")
print(f"Student: {is_student} (type: {type(is_student).__name__})")`,
      },
      {
        id: "user-input",
        title: "User Input",
        description: "Interactive input example",
        code: `# User Input Example
name = input("What is your name? ")
color = input("What is your favorite color? ")

print(f"\\nHello, {name}!")
print(f"Great choice! {color} is a beautiful color.")`,
      },
    ],
  },
  {
    id: "control-flow",
    name: "Control Flow",
    icon: <Code2 className="w-4 h-4" />,
    examples: [
      {
        id: "conditionals",
        title: "If/Else Statements",
        description: "Decision making",
        code: `# Conditional Statements
age = input("Enter your age: ")
age = int(age)

if age < 13:
    print("You are a child")
elif age < 20:
    print("You are a teenager")
elif age < 60:
    print("You are an adult")
else:
    print("You are a senior")`,
      },
      {
        id: "loops",
        title: "Loops",
        description: "For and while loops",
        code: `# Loop Examples

# For loop with range
print("Counting 1-5:")
for i in range(1, 6):
    print(f"  {i}")

# While loop
print("\\nCountdown:")
count = 5
while count > 0:
    print(f"  {count}...")
    count -= 1
print("  Liftoff!")

# Loop through a list
print("\\nFavorite fruits:")
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"  - {fruit}")`,
      },
    ],
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: <Sparkles className="w-4 h-4" />,
    examples: [
      {
        id: "lists",
        title: "Lists",
        description: "Working with lists",
        code: `# List Operations
numbers = [1, 2, 3, 4, 5]

print(f"Original: {numbers}")
print(f"Length: {len(numbers)}")
print(f"Sum: {sum(numbers)}")
print(f"First: {numbers[0]}, Last: {numbers[-1]}")

# List comprehension
squared = [n ** 2 for n in numbers]
print(f"Squared: {squared}")

# Filtering
evens = [n for n in numbers if n % 2 == 0]
print(f"Evens: {evens}")`,
      },
      {
        id: "dictionaries",
        title: "Dictionaries",
        description: "Key-value pairs",
        code: `# Dictionary Operations
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York",
    "skills": ["Python", "JavaScript", "SQL"]
}

print(f"Name: {person['name']}")
print(f"Age: {person['age']}")
print(f"City: {person['city']}")
print(f"Skills: {', '.join(person['skills'])}")

# Iterate over dictionary
print("\\nAll info:")
for key, value in person.items():
    print(f"  {key}: {value}")`,
      },
    ],
  },
  {
    id: "functions",
    name: "Functions",
    icon: <Code2 className="w-4 h-4" />,
    examples: [
      {
        id: "basic-functions",
        title: "Basic Functions",
        description: "Defining and calling functions",
        code: `# Function Examples

def greet(name):
    """Simple greeting function"""
    return f"Hello, {name}!"

def calculate_area(length, width):
    """Calculate rectangle area"""
    return length * width

def factorial(n):
    """Calculate factorial recursively"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Using the functions
name = input("Enter your name: ")
print(greet(name))

print(f"\\nArea of 5x3 rectangle: {calculate_area(5, 3)}")
print(f"Factorial of 5: {factorial(5)}")`,
      },
      {
        id: "lambda",
        title: "Lambda Functions",
        description: "Anonymous functions",
        code: `# Lambda Functions

# Simple lambda
double = lambda x: x * 2
print(f"Double of 5: {double(5)}")

# Lambda with map
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(f"Squared: {squared}")

# Lambda with filter
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Evens: {evens}")

# Lambda with sorted
words = ["apple", "pie", "banana", "cherry"]
sorted_by_length = sorted(words, key=lambda x: len(x))
print(f"Sorted by length: {sorted_by_length}")`,
      },
    ],
  },
]

interface ExamplesPanelProps {
  onSelectExample: (code: string) => void
}

export function ExamplesPanel({ onSelectExample }: ExamplesPanelProps) {
  const [openCategories, setOpenCategories] = useState<string[]>(["basics"])
  
  const toggleCategory = (id: string) => {
    setOpenCategories(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }
  
  return (
    <div className="h-full flex flex-col bg-card rounded-md overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Code Examples</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {exampleCategories.map((category) => (
          <Collapsible
            key={category.id}
            open={openCategories.includes(category.id)}
            onOpenChange={() => toggleCategory(category.id)}
            className="mb-2"
          >
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-secondary/50 transition-colors">
                {openCategories.includes(category.id) ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                {category.icon}
                <span className="font-medium">{category.name}</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-1 space-y-1">
                {category.examples.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => onSelectExample(example.code)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {example.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {example.description}
                    </p>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Click an example to load it into the editor
        </p>
      </div>
    </div>
  )
}
