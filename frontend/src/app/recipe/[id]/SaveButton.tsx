"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

export default function SaveButton({ recipeId, initialSaved }: { recipeId: string; initialSaved: boolean }) {
  const { getToken } = useAuth()
  const [saved, setSaved] = useState(initialSaved)
  const [busy, setBusy] = useState(false)

  async function handleToggle() {
    if (busy) return
    setBusy(true)
    try {
      const token = await getToken()
      const res = await fetch(`/api/saved-recipes${saved ? `/${recipeId}` : ""}`, {
        method: saved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: saved ? undefined : JSON.stringify({ recipeId }),
      })
      if (res.ok) setSaved(!saved)
    } catch {
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={busy}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        saved
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {busy ? "Saving..." : saved ? "Saved ✓" : "Save"}
    </button>
  )
}
