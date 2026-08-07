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
  source: "AI" | "MANUAL"
  createdAt: string
  averageRating?: number | null
  reviewCount?: number
  author?: {
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
  } | null
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

export interface CreateRecipeInput {
  title: string
  servings: number
  timeMinutes: number
  ingredients: { name: string; quantity: string }[]
  steps: string[]
  cuisine?: string
  dietary?: string[]
  isPublic?: boolean
}

export async function createRecipe(data: CreateRecipeInput, token: string) {
  return apiFetch("/api/recipe", { method: "POST", body: data, token }) as Promise<{ recipe: RecipeData }>
}

export interface ReviewData {
  id: string
  rating: number
  comment: string | null
  userId: string
  recipeId: string
  createdAt: string
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
  }
}

export interface ReviewsResponse {
  reviews: ReviewData[]
  averageRating: number | null
}

export async function getReviews(recipeId: string) {
  return apiFetch(`/api/recipe/${recipeId}/reviews`) as Promise<ReviewsResponse>
}

export async function createReview(recipeId: string, data: { rating: number; comment?: string }, token: string) {
  return apiFetch(`/api/recipe/${recipeId}/reviews`, { method: "POST", body: data, token }) as Promise<{ review: ReviewData }>
}

export async function updateReview(recipeId: string, reviewId: string, data: { rating: number; comment?: string }, token: string) {
  return apiFetch(`/api/recipe/${recipeId}/reviews/${reviewId}`, { method: "PATCH", body: data, token }) as Promise<{ review: ReviewData }>
}

export async function deleteReview(recipeId: string, reviewId: string, token: string) {
  return apiFetch(`/api/recipe/${recipeId}/reviews/${reviewId}`, { method: "DELETE", token }) as Promise<{ success: boolean }>
}
