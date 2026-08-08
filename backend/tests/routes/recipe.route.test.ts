import { describe, it, expect, beforeEach, vi } from "vitest"
import request from "supertest"
import express from "express"
import { makeRecipe } from "../helpers/prismaMock"
import { mockPrisma } from "../setup"

import recipeRouter from "../../src/modules/recipe/recipe.route"

const app = express()
app.use(express.json())
app.use("/api/recipe", recipeRouter)

beforeEach(() => {
  vi.clearAllMocks()
})

describe("GET /api/recipe/public", () => {
  it("returns public recipes", async () => {
    mockPrisma.recipe.findMany.mockResolvedValue([makeRecipe({ id: "r1" })])

    const res = await request(app).get("/api/recipe/public")

    expect(res.status).toBe(200)
    expect(res.body.recipes).toHaveLength(1)
    expect(res.body.recipes[0].id).toBe("r1")
  })

  it("returns 500 when the database fails", async () => {
    mockPrisma.recipe.findMany.mockRejectedValue(new Error("db down"))

    const res = await request(app).get("/api/recipe/public")

    expect(res.status).toBe(500)
    expect(res.body.error).toBe("Internal server error")
  })
})

describe("GET /api/recipe", () => {
  it("returns the current user's recipes", async () => {
    mockPrisma.recipe.findMany.mockResolvedValue([makeRecipe({ id: "r1", userId: "user-1" })])

    const res = await request(app).get("/api/recipe")

    expect(res.status).toBe(200)
    expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", deletedAt: null } })
    )
    expect(res.body.recipes[0].id).toBe("r1")
  })
})

describe("GET /api/recipe/:id", () => {
  it("returns a recipe", async () => {
    mockPrisma.recipe.findFirst.mockResolvedValue(makeRecipe({ id: "r1" }))

    const res = await request(app).get("/api/recipe/r1")

    expect(res.status).toBe(200)
    expect(res.body.recipe.id).toBe("r1")
  })

  it("returns 404 when not found", async () => {
    mockPrisma.recipe.findFirst.mockResolvedValue(null)

    const res = await request(app).get("/api/recipe/missing")

    expect(res.status).toBe(404)
    expect(res.body.error).toBe("Recipe not found")
  })
})

describe("POST /api/recipe", () => {
  const validBody = {
    title: "Pasta",
    servings: 2,
    timeMinutes: 20,
    ingredients: [{ name: "Pasta", quantity: "200g" }],
    steps: ["Boil"],
  }

  it("creates a recipe", async () => {
    mockPrisma.recipe.create.mockResolvedValue(makeRecipe({ id: "r1", title: "Pasta" }))
    mockPrisma.savedRecipe.create.mockResolvedValue({ id: "s1" })

    const res = await request(app).post("/api/recipe").send(validBody)

    expect(res.status).toBe(201)
    expect(res.body.recipe.id).toBe("r1")
  })

  it("returns 400 when the title is missing", async () => {
    const res = await request(app).post("/api/recipe").send({ ...validBody, title: undefined })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("Title is required")
  })

  it("returns 400 when ingredients are empty", async () => {
    const res = await request(app)
      .post("/api/recipe")
      .send({ ...validBody, ingredients: [] })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("At least one ingredient is required")
  })
})

describe("PATCH /api/recipe/:id", () => {
  it("updates a recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "user-1" }))
    mockPrisma.recipe.update.mockResolvedValue(makeRecipe({ id: "r1", title: "Updated" }))

    const res = await request(app).patch("/api/recipe/r1").send({ title: "Updated" })

    expect(res.status).toBe(200)
    expect(res.body.recipe.title).toBe("Updated")
  })

  it("returns 403 for another user's recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "other" }))

    const res = await request(app).patch("/api/recipe/r1").send({ title: "Hijack" })

    expect(res.status).toBe(403)
  })
})

describe("DELETE /api/recipe/:id", () => {
  it("soft-deletes a recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "user-1" }))
    mockPrisma.recipe.update.mockResolvedValue(makeRecipe({ id: "r1" }))

    const res = await request(app).delete("/api/recipe/r1")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it("returns 403 for another user's recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "other" }))

    const res = await request(app).delete("/api/recipe/r1")

    expect(res.status).toBe(403)
  })

  it("returns 404 when the recipe does not exist", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(null)

    const res = await request(app).delete("/api/recipe/missing")

    expect(res.status).toBe(404)
  })
})

describe("GET /api/recipe/trash", () => {
  it("returns trashed recipes", async () => {
    mockPrisma.recipe.findMany.mockResolvedValue([
      makeRecipe({ id: "r1", userId: "user-1", deletedAt: new Date() }),
    ])

    const res = await request(app).get("/api/recipe/trash")

    expect(res.status).toBe(200)
    expect(res.body.recipes).toHaveLength(1)
  })
})

describe("POST /api/recipe/trash/:id/restore", () => {
  it("restores a trashed recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(
      makeRecipe({ id: "r1", userId: "user-1", deletedAt: new Date() })
    )

    const res = await request(app).post("/api/recipe/trash/r1/restore")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it("returns 400 when the recipe is not in the trash", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "user-1" }))

    const res = await request(app).post("/api/recipe/trash/r1/restore")

    expect(res.status).toBe(400)
  })
})

describe("DELETE /api/recipe/trash/:id", () => {
  it("permanently deletes a trashed recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(
      makeRecipe({ id: "r1", userId: "user-1", deletedAt: new Date() })
    )

    const res = await request(app).delete("/api/recipe/trash/r1")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
