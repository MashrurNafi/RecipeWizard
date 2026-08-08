import { describe, it, expect, beforeEach, vi } from "vitest"
import { Prisma } from "../src/generated/prisma/client"
import { makeRecipe } from "./helpers/prismaMock"
import { mockPrisma } from "./setup"

import { getSavedRecipes, saveRecipe, unsaveRecipe } from "../src/modules/saveRecipe/saveRecipe.service"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getSavedRecipes", () => {
  it("returns saved recipes with rating stats", async () => {
    mockPrisma.savedRecipe.findMany.mockResolvedValue([
      {
        id: "s1",
        userId: "user-1",
        recipeId: "r1",
        savedAt: new Date("2026-01-01T00:00:00Z"),
        recipe: makeRecipe({ id: "r1", reviews: [{ rating: 5 }] }),
      },
    ])

    const saved = await getSavedRecipes("user-1")

    expect(mockPrisma.savedRecipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", recipe: { deletedAt: null } } })
    )
    expect(saved).toHaveLength(1)
    expect(saved[0].recipe).toMatchObject({ id: "r1", averageRating: 5, reviewCount: 1 })
  })
})

describe("saveRecipe", () => {
  it("saves a recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.savedRecipe.create.mockResolvedValue({ id: "s1", userId: "user-1", recipeId: "r1" })

    const saved = await saveRecipe("user-1", "r1")

    expect(mockPrisma.savedRecipe.create).toHaveBeenCalledWith({
      data: { userId: "user-1", recipeId: "r1" },
    })
    expect(saved.id).toBe("s1")
  })

  it("throws 404 when the recipe does not exist", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(null)
    await expect(saveRecipe("user-1", "missing")).rejects.toMatchObject({ status: 404 })
  })

  it("returns the existing entry on duplicate save", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.savedRecipe.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Duplicate", {
        code: "P2002",
        clientVersion: "7.9.1",
      })
    )
    mockPrisma.savedRecipe.findUnique.mockResolvedValue({
      id: "s1",
      userId: "user-1",
      recipeId: "r1",
    })

    const saved = await saveRecipe("user-1", "r1")

    expect(saved.id).toBe("s1")
  })

  it("rethrows non-duplicate errors", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe())
    mockPrisma.savedRecipe.create.mockRejectedValue(new Error("db down"))

    await expect(saveRecipe("user-1", "r1")).rejects.toThrow("db down")
  })
})

describe("unsaveRecipe", () => {
  it("unsaves a recipe", async () => {
    mockPrisma.savedRecipe.deleteMany.mockResolvedValue({ count: 1 })

    const result = await unsaveRecipe("user-1", "r1")

    expect(result).toBe(true)
    expect(mockPrisma.savedRecipe.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", recipeId: "r1" },
    })
  })

  it("throws 404 when nothing was saved", async () => {
    mockPrisma.savedRecipe.deleteMany.mockResolvedValue({ count: 0 })
    await expect(unsaveRecipe("user-1", "r1")).rejects.toMatchObject({ status: 404 })
  })
})
