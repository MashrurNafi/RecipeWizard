import { vi } from "vitest"

export function createPrismaMock() {
  const recipe = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  }

  const review = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }

  const savedRecipe = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  }

  const user = {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
  }

  const tx = {
    recipe: { create: recipe.create },
    savedRecipe: { create: savedRecipe.create },
  }

  const prisma = {
    recipe,
    review,
    savedRecipe,
    user,
    $transaction: vi.fn(async (fn: (t: typeof tx) => unknown) => fn(tx)),
    $disconnect: vi.fn(),
  }

  return { prisma, tx }
}

export function makeRecipe(overrides: Record<string, unknown> = {}) {
  return {
    id: "recipe-1",
    title: "Test Recipe",
    servings: 2,
    timeMinutes: 30,
    cuisine: "Italian",
    dietary: ["vegetarian"],
    ingredients: [{ name: "Tomato", quantity: "2" }],
    steps: ["Cook"],
    userId: "user-1",
    isPublic: true,
    source: "MANUAL",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    deletedAt: null,
    reviews: [],
    ...overrides,
  }
}
