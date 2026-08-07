"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import LoadingScreen from "@/components/LoadingScreen"

const DIETARY_OPTIONS = ["vegan", "vegetarian", "gluten-free", "keto", "paleo", "dairy-free", "low-carb", "nut-free"]
const CUISINE_OPTIONS = [
  "Italian", "Mexican", "Indian", "Chinese", "Japanese", "Thai",
  "Korean", "Mediterranean", "French", "American", "Greek", "Lebanese",
]

export default function GeneratePage() {
  const router = useRouter()
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const [ingredientsInput, setIngredientsInput] = useState("")
  const [dietary, setDietary] = useState<string[]>([])
  const [cuisine, setCuisine] = useState("")
  const [timeMinutes, setTimeMinutes] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isLoaded) {
    return <LoadingScreen />
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <div className="mb-4 text-4xl">🔒</div>
        <h1 className="mb-2 text-2xl font-bold">Sign in to Generate Recipes</h1>
        <p className="text-zinc-600">You need to be signed in to use the AI recipe generator.</p>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    const ingredients = ingredientsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    if (ingredients.length === 0) {
      setError("Please enter at least one ingredient.")
      return
    }

    setLoading(true)
    try {
      const token = await getToken()
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ingredients, dietary, cuisine: cuisine || undefined, timeMinutes }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      router.push(`/recipe/${data.recipeId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate recipe")
    } finally {
      setLoading(false)
    }
  }

  function toggleDietary(option: string) {
    setDietary((prev) =>
      prev.includes(option) ? prev.filter((d) => d !== option) : [...prev, option]
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold">Generate a Recipe</h1>
      <p className="mb-8 text-zinc-600">Tell us what you have and we&apos;ll create a recipe for you.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ingredients" className="mb-1 block font-medium text-sm">
            Ingredients <span className="text-red-500">*</span>
          </label>
          <input
            id="ingredients"
            type="text"
            value={ingredientsInput}
            onChange={(e) => setIngredientsInput(e.target.value)}
            placeholder="e.g., chicken, rice, garlic, onion"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <p className="mt-1 text-xs text-zinc-400">Separate ingredients with commas.</p>
        </div>

        <div>
          <label className="mb-1 block font-medium text-sm">Dietary Preferences</label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleDietary(option)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  dietary.includes(option)
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="cuisine" className="mb-1 block font-medium text-sm">
            Cuisine Preference
          </label>
          <select
            id="cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">Any cuisine</option>
            {CUISINE_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="time" className="mb-1 block font-medium text-sm">
            Max Cooking Time: <span className="text-emerald-600">{timeMinutes} minutes</span>
          </label>
          <input
            id="time"
            type="range"
            min={5}
            max={180}
            step={5}
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>5 min</span>
            <span>180 min</span>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating...
            </span>
          ) : (
            "Generate Recipe"
          )}
        </button>
      </form>
    </div>
  )
}
