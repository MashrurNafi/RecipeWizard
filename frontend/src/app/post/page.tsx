"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { createRecipe } from "@/lib/api"

const DIETARY_OPTIONS = ["vegan", "vegetarian", "gluten-free", "keto", "paleo", "dairy-free", "low-carb", "nut-free"]
const CUISINE_OPTIONS = [
  "Italian", "Mexican", "Indian", "Chinese", "Japanese", "Thai",
  "Korean", "Mediterranean", "French", "American", "Greek", "Lebanese",
]

interface IngredientRow {
  name: string
  quantity: string
}

export default function PostRecipePage() {
  const router = useRouter()
  const { isSignedIn, getToken } = useAuth()
  const [title, setTitle] = useState("")
  const [servings, setServings] = useState(2)
  const [timeMinutes, setTimeMinutes] = useState(30)
  const [cuisine, setCuisine] = useState("")
  const [dietary, setDietary] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ name: "", quantity: "" }])
  const [steps, setSteps] = useState<string[]>([""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <div className="mb-4 text-4xl">🔒</div>
        <h1 className="mb-2 text-2xl font-bold">Sign in to Post a Recipe</h1>
        <p className="text-zinc-600">You need to be signed in to share your own recipes.</p>
      </div>
    )
  }

  function updateIngredient(index: number, field: "name" | "quantity", value: string) {
    setIngredients((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { name: "", quantity: "" }])
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  function updateStep(index: number, value: string) {
    setSteps((prev) => prev.map((step, i) => (i === index ? value : step)))
  }

  function addStep() {
    setSteps((prev) => [...prev, ""])
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  function toggleDietary(option: string) {
    setDietary((prev) =>
      prev.includes(option) ? prev.filter((d) => d !== option) : [...prev, option]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    const cleanedIngredients = ingredients
      .map((row) => ({ name: row.name.trim(), quantity: row.quantity.trim() }))
      .filter((row) => row.name)
    const cleanedSteps = steps.map((s) => s.trim()).filter(Boolean)

    if (!title.trim()) {
      setError("Please enter a recipe title.")
      return
    }
    if (cleanedIngredients.length === 0) {
      setError("Please add at least one ingredient.")
      return
    }
    if (cleanedSteps.length === 0) {
      setError("Please add at least one step.")
      return
    }

    setLoading(true)
    try {
      const token = await getToken()
      const data = await createRecipe(
        {
          title: title.trim(),
          servings,
          timeMinutes,
          cuisine: cuisine || undefined,
          dietary,
          ingredients: cleanedIngredients,
          steps: cleanedSteps,
        },
        token ?? ""
      )
      router.push(`/recipe/${data.recipe.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post recipe")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold">Post a Recipe</h1>
      <p className="mb-8 text-zinc-600">Share your own recipe with the community.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-1 block font-medium text-sm">
            Recipe Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Grandma's Chicken Soup"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="servings" className="mb-1 block font-medium text-sm">
              Servings <span className="text-red-500">*</span>
            </label>
            <input
              id="servings"
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="time" className="mb-1 block font-medium text-sm">
              Cooking Time (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              id="time"
              type="number"
              min={1}
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="cuisine" className="mb-1 block font-medium text-sm">
            Cuisine
          </label>
          <select
            id="cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className={inputClass}
          >
            <option value="">Any cuisine</option>
            {CUISINE_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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
          <div className="mb-1 flex items-center justify-between">
            <label className="block font-medium text-sm">
              Ingredients <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addIngredient}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              + Add ingredient
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.quantity}
                  onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                  placeholder="Quantity"
                  className={`${inputClass} !w-28 shrink-0`}
                />
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => updateIngredient(index, "name", e.target.value)}
                  placeholder="Ingredient name"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                  className="shrink-0 rounded-lg px-2 py-2 text-zinc-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Remove ingredient"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block font-medium text-sm">
              Instructions <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addStep}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              + Add step
            </button>
          </div>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder="Describe this step..."
                  rows={2}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={steps.length === 1}
                  className="mt-1.5 shrink-0 rounded-lg px-2 py-2 text-zinc-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Remove step"
                >
                  ✕
                </button>
              </div>
            ))}
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
              Posting...
            </span>
          ) : (
            "Post Recipe"
          )}
        </button>
      </form>
    </div>
  )
}
