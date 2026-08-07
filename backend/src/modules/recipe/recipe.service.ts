import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { HttpError } from "../../lib/httpError"

export type RecipeCreateInput = {
  title: string
  servings: number
  timeMinutes: number
  ingredients: Prisma.InputJsonValue
  steps: Prisma.InputJsonValue
  cuisine?: string | null
  dietary?: string[]
  isPublic?: boolean
}

function withRatingStats<T extends { reviews: { rating: number }[] }>(recipe: T) {
  const { reviews, ...rest } = recipe
  const reviewCount = reviews.length
  const averageRating = reviewCount
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 10) / 10
    : null
  return { ...rest, averageRating, reviewCount }
}

export async function getPublicRecipes() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublic: true },
    include: {
      author: { select: { firstName: true, lastName: true, imageUrl: true } },
      reviews: { select: { rating: true } },
    },
  })

  return recipes
    .map(withRatingStats)
    .sort((a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1))
}

export async function getUserRecipes(userId: string) {
  const recipes = await prisma.recipe.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { firstName: true, lastName: true, imageUrl: true } },
      reviews: { select: { rating: true } },
    },
  })

  return recipes.map(withRatingStats)
}

export async function getRecipeById(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      author: { select: { firstName: true, lastName: true, imageUrl: true } },
      reviews: { select: { rating: true } },
    },
  })

  return recipe ? withRatingStats(recipe) : null
}

export async function createRecipe(userId: string, data: RecipeCreateInput) {
  return prisma.recipe.create({
    data: {
      title: data.title,
      servings: data.servings,
      timeMinutes: data.timeMinutes,
      ingredients: data.ingredients,
      steps: data.steps,
      cuisine: data.cuisine ?? null,
      dietary: data.dietary ?? [],
      isPublic: data.isPublic ?? true,
      source: "MANUAL" as const,
      userId,
    },
  })
}

export async function updateRecipe(id: string, userId: string, data: Partial<RecipeCreateInput>) {
  const existing = await prisma.recipe.findUnique({ where: { id } })
  if (!existing) throw new HttpError(404, "Recipe not found")
  if (existing.userId !== userId) throw new HttpError(403, "Forbidden")

  return prisma.recipe.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.servings !== undefined ? { servings: data.servings } : {}),
      ...(data.timeMinutes !== undefined ? { timeMinutes: data.timeMinutes } : {}),
      ...(data.ingredients !== undefined ? { ingredients: data.ingredients } : {}),
      ...(data.steps !== undefined ? { steps: data.steps } : {}),
      ...(data.cuisine !== undefined ? { cuisine: data.cuisine } : {}),
      ...(data.dietary !== undefined ? { dietary: data.dietary } : {}),
      ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
    },
  })
}

export async function deleteRecipe(id: string, userId: string) {
  const existing = await prisma.recipe.findUnique({ where: { id } })
  if (!existing) throw new HttpError(404, "Recipe not found")
  if (existing.userId !== userId) throw new HttpError(403, "Forbidden")

  await prisma.recipe.delete({ where: { id } })
  return true
}