import "dotenv/config"
import express from "express"
import cors from "cors"
import generateRouter from "./routes/generate"
import recipeRouter from "./modules/recipe/recipe.route"
import saveRecipeRouter from "./modules/saveRecipe/saveRecipe.route"
import userRouter from "./modules/user/user.route"
import { purgeExpiredTrash } from "./modules/recipe/recipe.service"

const app = express()
const PORT = process.env.PORT || 3001

const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000

async function cleanupExpiredTrash() {
  try {
    const purged = await purgeExpiredTrash(TRASH_RETENTION_MS)
    if (purged > 0) console.log(`[trash] permanently deleted ${purged} expired recipe(s)`)
  } catch (error) {
    console.error("[trash] cleanup failed:", error)
  }
}

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }))
app.use(express.json())

app.use("/api/generate", generateRouter)
app.use("/api/recipe", recipeRouter)
app.use("/api/saved-recipes", saveRecipeRouter)
app.use("/api/user", userRouter)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
  cleanupExpiredTrash()
  setInterval(cleanupExpiredTrash, 24 * 60 * 60 * 1000)
})
