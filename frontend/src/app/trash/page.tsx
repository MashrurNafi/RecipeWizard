import { auth } from "@clerk/nextjs/server"
import TrashItem from "./TrashItem"
import Link from "next/link"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export const dynamic = "force-dynamic"

export default async function TrashPage() {
  const session = await auth()
  const userId = session.userId
  const token = userId ? await session.getToken() : null

  let recipes: {
    id: string
    title: string
    cuisine: string | null
    timeMinutes: number
    servings: number
    source: "AI" | "MANUAL"
    deletedAt: string | null
    daysLeft: number
  }[] = []
  if (token) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/recipe/trash`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (res.ok) {
        const data = await res.json()
        const DAY_MS = 24 * 60 * 60 * 1000
        recipes = data.recipes.map((recipe: { deletedAt: string | null }) => ({
          ...recipe,
          daysLeft: recipe.deletedAt
            ? Math.max(0, Math.ceil((new Date(recipe.deletedAt).getTime() + 30 * DAY_MS - Date.now()) / DAY_MS))
            : 0,
        }))
      }
    } catch {}
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗑️</span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Trash</h1>
        </div>
        <p className="mt-2 text-zinc-600">
          Deleted recipes stay here for 30 days, then are permanently removed. Restore them any time before that.
        </p>
      </div>

      {!userId ? (
        <p className="rounded-xl border border-dashed border-zinc-300 py-16 text-center text-lg font-medium text-zinc-700">
          Sign in to view your trash bin.
        </p>
      ) : recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <div className="mb-3 text-4xl">🗑️</div>
          <p className="mb-1 text-lg font-medium text-zinc-700">Trash is empty</p>
          <p className="text-sm text-zinc-500">Recipes you delete will show up here.</p>
          <Link
            href="/saved"
            className="mt-5 inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Back to Saved
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <TrashItem
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              cuisine={recipe.cuisine}
              timeMinutes={recipe.timeMinutes}
              servings={recipe.servings}
              source={recipe.source}
              daysLeft={recipe.daysLeft}
            />
          ))}
        </div>
      )}
    </div>
  )
}