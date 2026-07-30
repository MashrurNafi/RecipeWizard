import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a recipe generator. Respond with ONLY valid JSON, no markdown fences, no commentary.
The JSON must exactly match this schema:
{
  "title": "string",
  "servings": "number",
  "timeMinutes": "number",
  "cuisine": "string",
  "dietary": ["string"],
  "ingredients": [{ "name": "string", "quantity": "string" }],
  "steps": ["string"]
}`

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

function getOrCreateUserId(cookieStore: Awaited<ReturnType<typeof cookies>>): string {
  const existing = cookieStore.get("recipe_uid")?.value
  if (existing) return existing
  const newId = uuidv4()
  return newId
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients, dietary, cuisine, timeMinutes } = await request.json()

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: "At least one ingredient is required" }, { status: 400 })
    }

    const userPrompt = [
      `Generate a recipe using these ingredients: ${ingredients.join(", ")}.`,
      dietary?.length ? `Dietary preferences: ${dietary.join(", ")}.` : "",
      cuisine ? `Cuisine: ${cuisine}.` : "",
      timeMinutes ? `Maximum cooking time: ${timeMinutes} minutes.` : "",
      "Respond with ONLY valid JSON matching the schema.",
    ]
      .filter(Boolean)
      .join(" ")

    let content: string | null = null

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
        })

        content = completion.choices[0]?.message?.content ?? null
        if (!content) throw new Error("Empty response from Groq")

        const parsed = parseRecipe(content)
        if (parsed && parsed.title && parsed.ingredients?.length && parsed.steps?.length) {
          const cookieStore = await cookies()
          const userId = getOrCreateUserId(cookieStore)

          if (!cookieStore.get("recipe_uid")) {
            cookieStore.set("recipe_uid", userId, {
              maxAge: 365 * 24 * 60 * 60,
              path: "/",
              httpOnly: true,
              sameSite: "lax",
            })
          }

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

          return NextResponse.json({ recipeId: recipe.id })
        }
      } catch {
        if (attempt === 1) throw new Error("Failed to generate recipe after retries")
      }
    }

    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
