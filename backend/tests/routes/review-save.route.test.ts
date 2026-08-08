import { describe, it, expect, beforeEach, vi } from "vitest"
import request from "supertest"
import express from "express"
import { makeRecipe } from "../helpers/prismaMock"
import { mockPrisma } from "../setup"

import recipeRouter from "../../src/modules/recipe/recipe.route"
import saveRecipeRouter from "../../src/modules/saveRecipe/saveRecipe.route"

const app = express()
app.use(express.json())
app.use("/api/recipe", recipeRouter)
app.use("/api/saved-recipes", saveRecipeRouter)

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

describe("reviews", () => {
  it("lists reviews for a recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.review.findMany.mockResolvedValue([reviewShape])

    const res = await request(app).get("/api/recipe/r1/reviews")

    expect(res.status).toBe(200)
    expect(res.body.reviews).toHaveLength(1)
    expect(res.body.averageRating).toBe(4)
  })

  it("creates a review", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.review.create.mockResolvedValue(reviewShape)

    const res = await request(app).post("/api/recipe/r1/reviews").send({ rating: 4, comment: "Great" })

    expect(res.status).toBe(201)
    expect(res.body.review.id).toBe("rev-1")
  })

  it("returns 400 for an invalid rating", async () => {
    const res = await request(app).post("/api/recipe/r1/reviews").send({ rating: 9 })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("Rating must be an integer between 1 and 5")
  })

  it("updates a review", async () => {
    mockPrisma.review.findUnique.mockResolvedValue(reviewShape)
    mockPrisma.review.update.mockResolvedValue({ ...reviewShape, rating: 5 })

    const res = await request(app).patch("/api/recipe/r1/reviews/rev-1").send({ rating: 5 })

    expect(res.status).toBe(200)
    expect(res.body.review.rating).toBe(5)
  })

  it("returns 403 when updating another user's review", async () => {
    mockPrisma.review.findUnique.mockResolvedValue({ ...reviewShape, userId: "other" })

    const res = await request(app).patch("/api/recipe/r1/reviews/rev-1").send({ rating: 5 })

    expect(res.status).toBe(403)
  })

  it("deletes a review", async () => {
    mockPrisma.review.findUnique.mockResolvedValue(reviewShape)

    const res = await request(app).delete("/api/recipe/r1/reviews/rev-1")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})

describe("saved recipes", () => {
  it("lists saved recipes", async () => {
    mockPrisma.savedRecipe.findMany.mockResolvedValue([
      {
        id: "s1",
        userId: "user-1",
        recipeId: "r1",
        savedAt: new Date("2026-01-01T00:00:00Z"),
        recipe: makeRecipe({ id: "r1" }),
      },
    ])

    const res = await request(app).get("/api/saved-recipes")

    expect(res.status).toBe(200)
    expect(res.body.saved).toHaveLength(1)
  })

  it("saves a recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.savedRecipe.create.mockResolvedValue({ id: "s1", userId: "user-1", recipeId: "r1" })

    const res = await request(app).post("/api/saved-recipes").send({ recipeId: "r1" })

    expect(res.status).toBe(201)
    expect(res.body.saved.id).toBe("s1")
  })

  it("returns 400 when recipeId is missing", async () => {
    const res = await request(app).post("/api/saved-recipes").send({})

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("recipeId is required")
  })

  it("unsaves a recipe", async () => {
    mockPrisma.savedRecipe.deleteMany.mockResolvedValue({ count: 1 })

    const res = await request(app).delete("/api/saved-recipes/r1")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it("returns 404 when nothing was saved", async () => {
    mockPrisma.savedRecipe.deleteMany.mockResolvedValue({ count: 0 })

    const res = await request(app).delete("/api/saved-recipes/r1")

    expect(res.status).toBe(404)
  })
})
