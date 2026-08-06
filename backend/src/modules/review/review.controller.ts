import { Request, Response } from "express"
import { HttpError, handleError } from "../../lib/httpError"
import { createReview, deleteReview, getReviewsForRecipe, updateReview } from "./review.service"

function parseRating(value: unknown): number {
  const rating = Number(value)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, "Rating must be an integer between 1 and 5")
  }
  return rating
}

export async function list(req: Request, res: Response) {
  try {
    const result = await getReviewsForRecipe(req.params.recipeId)
    res.json(result)
  } catch (error) {
    handleError(res, error)
  }
}

export async function create(req: Request, res: Response) {
  try {
    const rating = parseRating(req.body.rating)
    const comment = typeof req.body.comment === "string" ? req.body.comment : undefined

    const review = await createReview(req.params.recipeId, req.userId!, rating, comment)
    res.status(201).json({ review })
  } catch (error) {
    handleError(res, error)
  }
}

export async function update(req: Request, res: Response) {
  try {
    const rating = req.body.rating !== undefined ? parseRating(req.body.rating) : undefined
    const comment = req.body.comment !== undefined ? (typeof req.body.comment === "string" ? req.body.comment : undefined) : undefined

    const review = await updateReview(req.params.reviewId, req.userId!, { rating, comment })
    res.json({ review })
  } catch (error) {
    handleError(res, error)
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await deleteReview(req.params.reviewId, req.userId!)
    res.json({ success: true })
  } catch (error) {
    handleError(res, error)
  }
}