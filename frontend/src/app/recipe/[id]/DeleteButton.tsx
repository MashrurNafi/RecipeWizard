"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

export default function DeleteButton({ recipeId }: { recipeId: string }) {
  const router = useRouter()
  const { getToken } = useAuth()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Delete this recipe?")) return
    setDeleting(true)
    try {
      const token = await getToken()
      const res = await fetch(`/api/recipe/${recipeId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (res.ok) {
        router.push("/trash")
      } else {
        setDeleting(false)
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
