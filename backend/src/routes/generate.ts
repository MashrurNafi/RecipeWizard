import { Router, Request, Response } from "express"
import Groq from "groq-sdk"
import crypto from "node:crypto"
import { prisma } from "../lib/prisma"
import { requireAuth } from "../middleware/auth"

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Generate a recipe in JSON only:
{"title":"string","servings":0,"timeMinutes":0,"cuisine":"string","dietary":["string"],"ingredients":[{"name":"string","quantity":"string"}],"steps":["string"]}`

interface GroqRecipe {
  title: string
  servings: number
  timeMinutes: number
  cuisine: string
  dietary: string[]
  ingredients: { name: string; quantity: string }[]
  steps: string[]
}

function parseRecipe(raw: string): GroqRecipe | null {
  try {
    return JSON.parse(raw) as GroqRecipe
  } catch {
    return null
  }
}

function cacheKey(ingredients: string[], dietary: string[], cuisine: string, timeMinutes: number): string {
  return crypto.createHash("md5").update(JSON.stringify({ ingredients, dietary, cuisine, timeMinutes })).digest("hex")
}

const responseCache = new Map<string, { recipeId: string; expiresAt: number }>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!
    const { ingredients, dietary, cuisine, timeMinutes } = req.body

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      res.status(400).json({ error: "At least one ingredient is required" })
      return
    }

    const key = cacheKey(ingredients, dietary || [], cuisine || "", timeMinutes || 30)
    const cached = responseCache.get(key)
    if (cached && Date.now() < cached.expiresAt) {
      const exists = await prisma.recipe.findUnique({ where: { id: cached.recipeId } })
      if (exists) {
        res.json({ recipeId: cached.recipeId })
        return
      }
      responseCache.delete(key)
    }

    if (!checkRateLimit(userId)) {
      res.status(429).json({ error: "Too many requests. Please wait a minute." })
      return
    }

    const userPrompt = [
      `Recipe with: ${ingredients.join(", ")}.`,
      dietary?.length ? `Diet: ${dietary.join(", ")}.` : "",
      cuisine ? `Cuisine: ${cuisine}.` : "",
      timeMinutes ? `Max ${timeMinutes} min.` : "",
    ].filter(Boolean).join(" ")

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 1024,
        })

        const content = completion.choices[0]?.message?.content
        if (!content) throw new Error("Empty response")

        const parsed = parseRecipe(content)
        if (parsed?.title && parsed.ingredients?.length && parsed.steps?.length) {
          const recipe = await prisma.recipe.create({
            data: {
              title: parsed.title,
              servings: parsed.servings,
              timeMinutes: parsed.timeMinutes,
              cuisine: parsed.cuisine || null,
              dietary: parsed.dietary || [],
              ingredients: parsed.ingredients,
              steps: parsed.steps,
              userId,
              isPublic: true,
            },
          })

          responseCache.set(key, { recipeId: recipe.id, expiresAt: Date.now() + CACHE_TTL_MS })
          res.json({ recipeId: recipe.id })
          return
        }
      } catch {
        if (attempt === 1) {
          res.status(500).json({ error: "Failed to generate recipe" })
          return
        }
      }
    }

    res.status(500).json({ error: "Failed to generate recipe" })
  } catch (error) {
    console.error("Generate error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
