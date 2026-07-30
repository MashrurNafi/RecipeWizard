import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import RecipeCard from "@/components/RecipeCard"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function SavedPage() {
  const session = await auth()
  const userId = session.userId

  const recipes = userId
    ? await prisma.recipe.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background, matching the home page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-teal-200/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Page header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-b from-white to-emerald-50 text-lg shadow-sm ring-1 ring-emerald-500/10">
                📖
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                Your Collection
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Saved Recipes
            </h1>
            <p className="mt-1 text-zinc-600">Your generated recipes, all in one place.</p>
          </div>

          {userId && recipes.length > 0 && (
            <Link
              href="/generate"
              className="group inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20 active:scale-95 sm:self-auto"
            >
              <span className="text-base leading-none transition-transform group-hover:rotate-90">+</span>
              New Recipe
            </Link>
          )}
        </div>

        {!userId ? (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-white/60 py-20 text-center shadow-sm backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-emerald-50 text-4xl shadow-sm ring-1 ring-emerald-500/10">
              🔒
            </div>
            <p className="mb-1 text-lg font-semibold text-zinc-800">Sign in to see your saved recipes</p>
            <p className="text-sm text-zinc-500">Your recipes are tied to your account.</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-white/60 py-20 text-center shadow-sm backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-emerald-50 text-4xl shadow-sm ring-1 ring-emerald-500/10">
              📭
            </div>
            <p className="mb-1 text-lg font-semibold text-zinc-800">No saved recipes yet</p>
            <p className="mb-5 text-sm text-zinc-500">Generate your first recipe to see it here.</p>
            <Link
              href="/generate"
              className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20 active:scale-95"
            >
              Generate a Recipe
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} saved
            </div>
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
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}