const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

interface RequestOptions {
  method?: string
  body?: unknown
  token?: string | null
}

async function apiFetch(path: string, { method = "GET", body, token }: RequestOptions = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Request failed")
  return data
}

export interface RecipeData {
  id: string
  title: string
  servings: number
  timeMinutes: number
  cuisine: string | null
  dietary: string[]
  ingredients: { name: string; quantity: string }[]
  steps: string[]
  userId: string
  isPublic: boolean
  createdAt: string
}

export async function getPublicRecipes() {
  return apiFetch("/api/recipe/public") as Promise<{ recipes: RecipeData[] }>
}

export async function getUserRecipes(token: string) {
  return apiFetch("/api/recipe", { token }) as Promise<{ recipes: RecipeData[] }>
}

export async function getRecipe(id: string) {
  return apiFetch(`/api/recipe/${id}`) as Promise<{ recipe: RecipeData }>
}

export async function deleteRecipe(id: string, token: string) {
  return apiFetch(`/api/recipe/${id}`, { method: "DELETE", token }) as Promise<{ success: boolean }>
}

export async function generateRecipe(
  data: { ingredients: string[]; dietary: string[]; cuisine?: string; timeMinutes?: number },
  token: string
) {
  return apiFetch("/api/generate", { method: "POST", body: data, token }) as Promise<{ recipeId: string }>
}
