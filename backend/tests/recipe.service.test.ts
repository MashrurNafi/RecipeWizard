import { describe, it, expect, beforeEach, vi } from "vitest"
import { HttpError } from "../src/lib/httpError"
import { makeRecipe } from "./helpers/prismaMock"
import { mockPrisma } from "./setup"

import {
  createRecipe,
  deleteRecipe,
  getPublicRecipes,
  getRecipeById,
  getTrashedRecipes,
  getUserRecipes,
  purgeExpiredTrash,
  purgeRecipe,
  restoreRecipe,
  updateRecipe,
  withRatingStats,
} from "../src/modules/recipe/recipe.service"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("withRatingStats", () => {
  it("computes average rating and review count", () => {
    const recipe = { id: "r1", reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }] } as never
    const result = withRatingStats(recipe)
    expect(result.averageRating).toBe(4.3)
    expect(result.reviewCount).toBe(3)
  })

  it("returns null rating when there are no reviews", () => {
    const recipe = { id: "r1", reviews: [] } as never
    const result = withRatingStats(recipe)
    expect(result.averageRating).toBeNull()
    expect(result.reviewCount).toBe(0)
  })
})

describe("getPublicRecipes", () => {
  it("returns public recipes sorted by rating", async () => {
    mockPrisma.recipe.findMany.mockResolvedValue([
      makeRecipe({ id: "r1", createdAt: new Date("2026-01-02T00:00:00Z") }),
      makeRecipe({ id: "r2", reviews: [{ rating: 5 }], createdAt: new Date("2026-01-03T00:00:00Z") }),
    ])

    const recipes = await getPublicRecipes()

    expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true, deletedAt: null } })
    )
    expect(recipes[0].id).toBe("r2")
    expect(recipes[0].averageRating).toBe(5)
    expect(recipes[1].averageRating).toBeNull()
  })
})

describe("getUserRecipes", () => {
  it("returns the user's recipes with stats", async () => {
    mockPrisma.recipe.findMany.mockResolvedValue([makeRecipe({ id: "r1" })])

    const recipes = await getUserRecipes("user-1")

    expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", deletedAt: null } })
    )
    expect(recipes).toHaveLength(1)
    expect(recipes[0]).toMatchObject({ id: "r1", averageRating: null, reviewCount: 0 })
  })
})

describe("getRecipeById", () => {
  it("returns the recipe with stats", async () => {
    mockPrisma.recipe.findFirst.mockResolvedValue(makeRecipe({ id: "r1", reviews: [{ rating: 4 }] }))

    const recipe = await getRecipeById("r1")

    expect(recipe).toMatchObject({ id: "r1", averageRating: 4, reviewCount: 1 })
  })

  it("returns null when the recipe is deleted or missing", async () => {
    mockPrisma.recipe.findFirst.mockResolvedValue(null)
    expect(await getRecipeById("missing")).toBeNull()
  })
})

describe("createRecipe", () => {
  it("creates a recipe and auto-saves it in a transaction", async () => {
    mockPrisma.recipe.create.mockResolvedValue(makeRecipe({ id: "r1", source: "MANUAL" }))
    mockPrisma.savedRecipe.create.mockResolvedValue({ id: "s1", userId: "user-1", recipeId: "r1" })

    const recipe = await createRecipe("user-1", {
      title: "Test Recipe",
      servings: 2,
      timeMinutes: 30,
      ingredients: [{ name: "Tomato", quantity: "2" }],
      steps: ["Cook"],
    })

    expect(recipe.id).toBe("r1")
    expect(mockPrisma.recipe.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: "Test Recipe", source: "MANUAL", userId: "user-1" }),
    })
    expect(mockPrisma.savedRecipe.create).toHaveBeenCalledWith({
      data: { userId: "user-1", recipeId: "r1" },
    })
  })
})

describe("updateRecipe", () => {
  it("updates the recipe when owned by the user", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "user-1" }))
    mockPrisma.recipe.update.mockResolvedValue(makeRecipe({ id: "r1", title: "Updated" }))

    const recipe = await updateRecipe("r1", "user-1", { title: "Updated" })

    expect(mockPrisma.recipe.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { title: "Updated" },
    })
    expect(recipe.title).toBe("Updated")
  })

  it("throws 404 when the recipe does not exist", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(null)
    await expect(updateRecipe("r1", "user-1", {})).rejects.toMatchObject({ status: 404 })
  })

  it("throws 403 when owned by another user", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "other" }))
    await expect(updateRecipe("r1", "user-1", {})).rejects.toMatchObject({ status: 403 })
  })
})

describe("deleteRecipe", () => {
  it("soft-deletes the recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "user-1" }))
    mockPrisma.recipe.update.mockResolvedValue(makeRecipe({ id: "r1", deletedAt: new Date() }))

    const result = await deleteRecipe("r1", "user-1")

    expect(result).toBe(true)
    expect(mockPrisma.recipe.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { deletedAt: expect.any(Date) },
    })
  })

  it("throws 403 for another user's recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "other" }))
    await expect(deleteRecipe("r1", "user-1")).rejects.toBeInstanceOf(HttpError)
    await expect(deleteRecipe("r1", "user-1")).rejects.toMatchObject({ status: 403 })
  })
})

describe("getTrashedRecipes", () => {
  it("returns only trashed recipes", async () => {
    mockPrisma.recipe.findMany.mockResolvedValue([
      makeRecipe({ id: "r1", deletedAt: new Date("2026-01-01T00:00:00Z") }),
    ])

    const recipes = await getTrashedRecipes("user-1")

    expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", deletedAt: { not: null } } })
    )
    expect(recipes).toHaveLength(1)
  })
})

describe("restoreRecipe", () => {
  it("restores a trashed recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(
      makeRecipe({ id: "r1", userId: "user-1", deletedAt: new Date() })
    )

    const result = await restoreRecipe("r1", "user-1")

    expect(result).toBe(true)
    expect(mockPrisma.recipe.update).toHaveBeenCalledWith({
      where: { id: "r1" },
      data: { deletedAt: null },
    })
  })

  it("throws 400 when the recipe is not in the trash", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "user-1" }))
    await expect(restoreRecipe("r1", "user-1")).rejects.toMatchObject({ status: 400 })
  })
})

describe("purgeRecipe", () => {
  it("permanently deletes a trashed recipe", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(
      makeRecipe({ id: "r1", userId: "user-1", deletedAt: new Date() })
    )

    const result = await purgeRecipe("r1", "user-1")

    expect(result).toBe(true)
    expect(mockPrisma.recipe.delete).toHaveBeenCalledWith({ where: { id: "r1" } })
  })

  it("throws 400 when the recipe is not in the trash", async () => {
    mockPrisma.recipe.findUnique.mockResolvedValue(makeRecipe({ id: "r1", userId: "user-1" }))
    await expect(purgeRecipe("r1", "user-1")).rejects.toMatchObject({ status: 400 })
  })
})

describe("purgeExpiredTrash", () => {
  it("deletes recipes past the retention window", async () => {
    mockPrisma.recipe.deleteMany.mockResolvedValue({ count: 3 })

    const count = await purgeExpiredTrash(1000)

    expect(count).toBe(3)
    expect(mockPrisma.recipe.deleteMany).toHaveBeenCalledWith({
      where: { deletedAt: { not: null, lt: expect.any(Date) } },
    })
  })
})
