import "dotenv/config"
import express from "express"
import cors from "cors"
import generateRouter from "./routes/generate"
import recipeRouter from "./modules/recipe/recipe.route"
import saveRecipeRouter from "./modules/saveRecipe/saveRecipe.route"
import userRouter from "./modules/user/user.route"

export const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }))
app.use(express.json())

app.use("/api/generate", generateRouter)
app.use("/api/recipe", recipeRouter)
app.use("/api/saved-recipes", saveRecipeRouter)
app.use("/api/user", userRouter)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})
