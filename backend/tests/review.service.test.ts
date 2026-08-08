import { describe, it, expect, beforeEach, vi } from "vitest"
import { Prisma } from "../src/generated/prisma/client"
import { makeRecipe } from "./helpers/prismaMock"
import { mockPrisma } from "./setup"

import {
  createReview,
  deleteReview,
  getReviewsForRecipe,
  updateReview,
} from "../src/modules/review/review.service"

const reviewShape = {
  id: "rev-1",
  recipeId: "r1",
  userId: "user-1",
  rating: 4,
  comment: "Great",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  user: { id: "user-1", firstName: "Test", lastName: null, imageUrl: null },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getReviewsForRecipe", () => {
  it("returns reviews with the average rating", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.review.findMany.mockResolvedValue([
      { ...reviewShape, rating: 4 },
      { ...reviewShape, id: "rev-2", rating: 5 },
    ])

    const result = await getReviewsForRecipe("r1")

    expect(result.reviews).toHaveLength(2)
    expect(result.averageRating).toBe(4.5)
  })

  it("returns null average when there are no reviews", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.review.findMany.mockResolvedValue([])

    const result = await getReviewsForRecipe("r1")

    expect(result.averageRating).toBeNull()
  })

  it("throws 404 when the recipe does not exist", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(null)
    await expect(getReviewsForRecipe("missing")).rejects.toMatchObject({ status: 404 })
  })
})

describe("createReview", () => {
  it("creates a review", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.review.create.mockResolvedValue(reviewShape)

    const review = await createReview("r1", "user-1", 4, "Great")

    expect(mockPrisma.review.create).toHaveBeenCalledWith({
      data: { recipeId: "r1", userId: "user-1", rating: 4, comment: "Great" },
    })
    expect(review.id).toBe("rev-1")
  })

  it("throws 404 when the recipe does not exist", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(null)
    await expect(createReview("r1", "user-1", 4)).rejects.toMatchObject({ status: 404 })
  })

  it("throws 409 when the user already reviewed the recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.review.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Duplicate", {
        code: "P2002",
        clientVersion: "7.9.1",
      })
    )

    await expect(createReview("r1", "user-1", 4)).rejects.toMatchObject({ status: 409 })
  })
})

describe("updateReview", () => {
  it("updates the review when owned by the user", async () => {
    mockPrisma.review.findUnique.mockResolvedValue(reviewShape)
    mockPrisma.review.update.mockResolvedValue({ ...reviewShape, rating: 5 })

    const review = await updateReview("rev-1", "user-1", { rating: 5 })

    expect(mockPrisma.review.update).toHaveBeenCalledWith({
      where: { id: "rev-1" },
      data: { rating: 5 },
    })
    expect(review.rating).toBe(5)
  })

  it("throws 404 when the review does not exist", async () => {
    mockPrisma.review.findUnique.mockResolvedValue(null)
    await expect(updateReview("rev-1", "user-1", {})).rejects.toMatchObject({ status: 404 })
  })

  it("throws 403 when owned by another user", async () => {
    mockPrisma.review.findUnique.mockResolvedValue({ ...reviewShape, userId: "other" })
    await expect(updateReview("rev-1", "user-1", {})).rejects.toMatchObject({ status: 403 })
  })
})

describe("deleteReview", () => {
  it("deletes the review when owned by the user", async () => {
    mockPrisma.review.findUnique.mockResolvedValue(reviewShape)

    const result = await deleteReview("rev-1", "user-1")

    expect(result).toBe(true)
    expect(mockPrisma.review.delete).toHaveBeenCalledWith({ where: { id: "rev-1" } })
  })

  it("throws 403 when owned by another user", async () => {
    mockPrisma.review.findUnique.mockResolvedValue({ ...reviewShape, userId: "other" })
    await expect(deleteReview("rev-1", "user-1")).rejects.toMatchObject({ status: 403 })
  })
})
