import { describe, it, expect, beforeEach, vi } from "vitest"
import request from "supertest"
import express from "express"
import { mockGroqCreate, mockPrisma } from "../setup"

import generateRouter from "../../src/routes/generate"

const app = express()
app.use(express.json())
app.use("/api/generate", generateRouter)

const VALID_RECIPE = JSON.stringify({
  title: "Tomato Soup",
  servings: 2,
  timeMinutes: 25,
  cuisine: "Italian",
  dietary: ["vegetarian"],
  ingredients: [{ name: "Tomato", quantity: "4" }],
  steps: ["Simmer", "Blend"],
})

function payload(ingredients: string[]) {
  return { ingredients, dietary: [], cuisine: "", timeMinutes: 30 }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("POST /api/generate", () => {
  it("returns 400 when no ingredients are provided", async () => {
    const res = await request(app).post("/api/generate").send({ ingredients: [] })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("At least one ingredient is required")
    expect(mockGroqCreate).not.toHaveBeenCalled()
  })

  it("generates and persists a recipe", async () => {
    mockGroqCreate.mockResolvedValue({
      choices: [{ message: { content: VALID_RECIPE } }],
    })
    mockPrisma.recipe.create.mockResolvedValue({ id: "r1", title: "Tomato Soup" })

    const res = await request(app).post("/api/generate").send(payload(["tomato"]))

    expect(res.status).toBe(200)
    expect(res.body.recipeId).toBe("r1")
    expect(mockGroqCreate).toHaveBeenCalledTimes(1)
    expect(mockPrisma.recipe.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: "Tomato Soup", userId: "user-1" }),
      })
    )
  })

  it("serves a cached recipe without calling the AI again", async () => {
    mockGroqCreate.mockResolvedValue({
      choices: [{ message: { content: VALID_RECIPE } }],
    })
    mockPrisma.recipe.create.mockResolvedValue({ id: "r1", title: "Tomato Soup" })
    mockPrisma.recipe.findUnique.mockResolvedValue({ id: "r1", title: "Tomato Soup" })

    await request(app).post("/api/generate").send(payload(["onion"]))
    const res = await request(app).post("/api/generate").send(payload(["onion"]))

    expect(res.status).toBe(200)
    expect(res.body.recipeId).toBe("r1")
    expect(mockGroqCreate).toHaveBeenCalledTimes(1)
  })

  it("returns 500 when the AI response cannot be parsed", async () => {
    mockGroqCreate.mockResolvedValue({ choices: [{ message: { content: "not json" } }] })

    const res = await request(app).post("/api/generate").send(payload(["spinach"]))

    expect(res.status).toBe(500)
    expect(res.body.error).toBe("Failed to generate recipe")
    expect(mockGroqCreate).toHaveBeenCalledTimes(2)
  })

  it("rate limits a user to 10 requests per minute", async () => {
    vi.resetModules()
    const { default: freshGenerateRouter } = await import("../../src/routes/generate")
    const freshApp = express()
    freshApp.use(express.json())
    freshApp.use("/api/generate", freshGenerateRouter)

    mockGroqCreate.mockResolvedValue({
      choices: [{ message: { content: VALID_RECIPE } }],
    })
    mockPrisma.recipe.create.mockResolvedValue({ id: "r1", title: "Tomato Soup" })

    let lastStatus = 0
    for (let i = 0; i < 11; i++) {
      const res = await request(freshApp).post("/api/generate").send(payload([`ingredient-${i}`]))
      lastStatus = res.status
    }

    expect(lastStatus).toBe(429)
    expect(mockGroqCreate).toHaveBeenCalledTimes(10)
  })
})
