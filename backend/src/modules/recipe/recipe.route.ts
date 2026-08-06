import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { create, getById, getMine, getPublic, remove, update } from "./recipe.controller"
import reviewRouter from "../review/review.route"

const router = Router()

router.get("/public", getPublic)
router.get("/", requireAuth, getMine)
router.get("/:id", getById)
router.post("/", requireAuth, create)
router.patch("/:id", requireAuth, update)
router.delete("/:id", requireAuth, remove)
router.use("/:recipeId/reviews", reviewRouter)

export default router