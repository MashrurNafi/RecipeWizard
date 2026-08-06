import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { HttpError } from "../../lib/httpError"

export async function getSavedRecipes(userId: string) {
  return prisma.savedRecipe.findMany({
    where: { userId },
    include: { recipe: true },
    orderBy: { savedAt: "desc" },
  })
}

export async function saveRecipe(userId: string, recipeId: string) {
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } })
  if (!recipe) throw new HttpError(404, "Recipe not found")

  try {
    return await prisma.savedRecipe.create({ data: { userId, recipeId } })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await prisma.savedRecipe.findUnique({
        where: { userId_recipeId: { userId, recipeId } },
      })
      if (existing) return existing
    }
    throw error
  }
}

export async function unsaveRecipe(userId: string, recipeId: string) {
  const result = await prisma.savedRecipe.deleteMany({ where: { userId, recipeId } })
  if (result.count === 0) throw new HttpError(404, "Saved recipe not found")
  return true
}