import { cookies } from "next/headers"

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("recipe_uid")?.value ?? null
}
