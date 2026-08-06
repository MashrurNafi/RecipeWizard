import { auth, currentUser } from "@clerk/nextjs/server"
import RecipeCard from "@/components/RecipeCard"
import Link from "next/link"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await auth()
  const user = await currentUser()
  const userId = session.userId
  const token = userId ? await session.getToken() : null

  let recipes: {
    id: string; title: string; cuisine: string | null; timeMinutes: number
    servings: number; dietary: string[]; source: "AI" | "MANUAL"
    author: { firstName: string | null; imageUrl: string | null } | null
  }[] = []
  if (token) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/recipe`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (res.ok) {
        const data = await res.json()
        recipes = data.recipes
      }
    } catch {}
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-full" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
            {user?.firstName?.[0] || "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{user?.firstName || "Your"} Profile</h1>
          <p className="text-sm text-zinc-500">
            {user?.emailAddresses?.[0]?.emailAddress || userId?.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Recipes ({recipes.length})</h2>
        <Link
          href="/generate"
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <div className="mb-3 text-4xl">📭</div>
          <p className="mb-1 text-lg font-medium text-zinc-700">No recipes yet</p>
          <p className="text-sm text-zinc-500">Generate your first recipe to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              cuisine={recipe.cuisine}
              timeMinutes={recipe.timeMinutes}
              servings={recipe.servings}
              dietary={recipe.dietary as string[]}
              showUser
              authorFirstName={recipe.author?.firstName}
              authorImageUrl={recipe.author?.imageUrl}
              source={recipe.source}
            />
          ))}
        </div>
      )}
    </div>
  )
}
