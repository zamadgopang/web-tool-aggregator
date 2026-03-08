"use client"

import { Construction, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ComingSoon() {
  return (
    <Card className="overflow-hidden border-border">
      <CardContent className="p-0">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 bg-secondary/30 p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Construction className="h-10 w-10" />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Coming Soon
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {"We're working hard to bring this tool to life. It will process everything locally in your browser for maximum privacy and speed."}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Notify me when ready
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
