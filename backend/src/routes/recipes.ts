import { Router, Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { requireAuth } from "../middleware/auth"

const router = Router()

router.get("/public", async (_req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    res.json({ recipes })
  } catch (error) {
    console.error("Get public recipes error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!
    const recipes = await prisma.recipe.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    res.json({ recipes })
  } catch (error) {
    console.error("Get recipes error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } })
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" })
      return
    }
    res.json({ recipe })
  } catch (error) {
    console.error("Get recipe error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } })
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" })
      return
    }
    if (recipe.userId !== userId) {
      res.status(403).json({ error: "Forbidden" })
      return
    }
    await prisma.recipe.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (error) {
    console.error("Delete recipe error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
