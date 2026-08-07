import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import {
  create,
  getById,
  getMine,
  getPublic,
  getTrash,
  purge,
  remove,
  restore,
  update,
} from "./recipe.controller"
import reviewRouter from "../review/review.route"

const router = Router()

router.get("/public", getPublic)
router.get("/trash", requireAuth, getTrash)
router.post("/trash/:id/restore", requireAuth, restore)
router.delete("/trash/:id", requireAuth, purge)
router.get("/", requireAuth, getMine)
router.get("/:id", getById)
router.post("/", requireAuth, create)
router.patch("/:id", requireAuth, update)
router.delete("/:id", requireAuth, remove)
router.use("/:recipeId/reviews", reviewRouter)

export default router