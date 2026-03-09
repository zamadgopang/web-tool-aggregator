"use client"

import { useEffect } from "react"

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return
    }

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js")
      } catch {
        // Keep registration failures silent for end users.
      }
    }

    register()
  }, [])

  return null
}