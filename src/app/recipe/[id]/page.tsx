import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import DeleteButton from "./DeleteButton"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  const userId = session.userId

  const recipe = await prisma.recipe.findUnique({ where: { id } })

  if (!recipe) {
    notFound()
  }

  const ingredients = recipe.ingredients as { name: string; quantity: string }[]
  const steps = recipe.steps as string[]
  const dietary = recipe.dietary as string[]
  const isOwner = userId && recipe.userId === userId

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-500">
            {recipe.cuisine && (
              <span className="rounded-full bg-zinc-100 px-3 py-1 capitalize">{recipe.cuisine}</span>
            )}
            <span className="rounded-full bg-zinc-100 px-3 py-1">{recipe.timeMinutes} min</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">{recipe.servings} servings</span>
          </div>
          {dietary.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {dietary.map((d: string) => (
                <span key={d} className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 capitalize">
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>
        {isOwner && <DeleteButton recipeId={recipe.id} />}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Ingredients</h2>
        <ul className="space-y-2">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-medium">{ing.name}</span>
              <span className="text-zinc-500">{ing.quantity}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Instructions</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="pt-0.5 leading-relaxed text-zinc-700">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {!userId && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 text-center">
          <p className="mb-2 text-sm text-zinc-600">Sign in to save and manage your recipes.</p>
        </div>
      )}
    </div>
  )
}
