import { prisma } from "@/lib/prisma"
import RecipeCard from "@/components/RecipeCard"

export const dynamic = "force-dynamic"

export default async function BrowsePage() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold">Explore Recipes</h1>
      <p className="mb-8 text-zinc-600">Discover recipes created by the community.</p>

      {recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <div className="mb-3 text-4xl">🌱</div>
          <p className="mb-1 text-lg font-medium text-zinc-700">No recipes yet</p>
          <p className="mb-4 text-sm text-zinc-500">Be the first to generate and share a recipe!</p>
          <a
            href="/generate"
            className="inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Generate a Recipe
          </a>
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
            />
          ))}
        </div>
      )}
    </div>
  )
}
