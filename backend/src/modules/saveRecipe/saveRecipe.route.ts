import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { list, save, unsave } from "./saveRecipe.controller"

const router = Router()

router.get("/", requireAuth, list)
router.post("/", requireAuth, save)
router.delete("/:recipeId", requireAuth, unsave)

export default router