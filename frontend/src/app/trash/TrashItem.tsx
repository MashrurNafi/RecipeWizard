"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"
import { deleteRecipeForever, restoreRecipe } from "@/lib/api"

interface TrashItemProps {
  id: string
  title: string
  cuisine: string | null
  timeMinutes: number
  servings: number
  source: "AI" | "MANUAL"
  daysLeft: number
}

export default function TrashItem({ id, title, cuisine, timeMinutes, servings, source, daysLeft }: TrashItemProps) {
  const router = useRouter()
  const { getToken } = useAuth()
  const [busy, setBusy] = useState<"restore" | "purge" | null>(null)

  async function handleRestore() {
    setBusy("restore")
    try {
      const token = await getToken()
      if (!token) return
      await restoreRecipe(id, token)
      router.refresh()
    } catch {
      setBusy(null)
    }
  }

  async function handlePurge() {
    if (!confirm("Permanently delete this recipe? This cannot be undone.")) return
    setBusy("purge")
    try {
      const token = await getToken()
      if (!token) return
      await deleteRecipeForever(id, token)
      router.refresh()
    } catch {
      setBusy(null)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-zinc-900">{title}</span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
              source === "AI" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {source === "AI" ? "AI" : "own recipe"}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          {cuisine ? `${cuisine} · ` : ""}
          {timeMinutes} min · {servings} servings
          {daysLeft > 0 ? ` · permanently deleted in ${daysLeft} day${daysLeft === 1 ? "" : "s"}` : " · expiring soon"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleRestore}
          disabled={busy !== null}
          className="rounded-full border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
        >
          {busy === "restore" ? "Restoring..." : "Restore"}
        </button>
        <button
          onClick={handlePurge}
          disabled={busy !== null}
          className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          {busy === "purge" ? "Deleting..." : "Delete Forever"}
        </button>
      </div>
    </div>
  )
}
