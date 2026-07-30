"use client"

import { useEffect } from "react"

export default function UserIdSetup() {
  useEffect(() => {
    if (!document.cookie.includes("recipe_uid=")) {
      const uuid = crypto.randomUUID()
      document.cookie = `recipe_uid=${uuid}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`
    }
  }, [])

  return null
}
