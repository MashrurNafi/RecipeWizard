"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteButton({ recipeId }: { recipeId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Delete this recipe?")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/recipe/${recipeId}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/saved")
      }
    } catch {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  )
}
