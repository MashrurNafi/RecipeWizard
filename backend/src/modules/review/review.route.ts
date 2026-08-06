import { Router } from "express"
import { requireAuth } from "../../middleware/auth"
import { create, list, remove, update } from "./review.controller"

const router = Router({ mergeParams: true })

router.get("/", list)
router.post("/", requireAuth, create)
router.patch("/:reviewId", requireAuth, update)
router.delete("/:reviewId", requireAuth, remove)

export default router