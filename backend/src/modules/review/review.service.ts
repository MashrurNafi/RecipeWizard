import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { HttpError } from "../../lib/httpError"

async function assertRecipeExists(recipeId: string) {
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } })
  if (!recipe) throw new HttpError(404, "Recipe not found")
}

export async function getReviewsForRecipe(recipeId: string) {
  await assertRecipeExists(recipeId)

  const reviews = await prisma.review.findMany({
    where: { recipeId },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null

  return { reviews, averageRating }
}

export async function createReview(recipeId: string, userId: string, rating: number, comment?: string) {
  await assertRecipeExists(recipeId)

  try {
    return await prisma.review.create({
      data: { recipeId, userId, rating, comment: comment ?? null },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(409, "You have already reviewed this recipe")
    }
    throw error
  }
}

export async function updateReview(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } })
  if (!existing) throw new HttpError(404, "Review not found")
  if (existing.userId !== userId) throw new HttpError(403, "Forbidden")

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.comment !== undefined ? { comment: data.comment } : {}),
    },
  })
}

export async function deleteReview(reviewId: string, userId: string) {
  const existing = await prisma.review.findUnique({ where: { id: reviewId } })
  if (!existing) throw new HttpError(404, "Review not found")
  if (existing.userId !== userId) throw new HttpError(403, "Forbidden")

  await prisma.review.delete({ where: { id: reviewId } })
  return true
}