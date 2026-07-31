import "dotenv/config"
import express from "express"
import cors from "cors"
import generateRouter from "./routes/generate"
import recipesRouter from "./routes/recipes"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }))
app.use(express.json())

app.use("/api/generate", generateRouter)
app.use("/api/recipe", recipesRouter)

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
