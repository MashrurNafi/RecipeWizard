import { Request, Response } from "express"
import { HttpError, handleError } from "../../lib/httpError"
import { getSavedRecipes, saveRecipe, unsaveRecipe } from "./saveRecipe.service"

export async function list(req: Request, res: Response) {
  try {
    const saved = await getSavedRecipes(req.userId!)
    res.json({ saved })
  } catch (error) {
    handleError(res, error)
  }
}

export async function save(req: Request, res: Response) {
  try {
    const { recipeId } = req.body
    if (!recipeId || typeof recipeId !== "string") throw new HttpError(400, "recipeId is required")

    const saved = await saveRecipe(req.userId!, recipeId)
    res.status(201).json({ saved })
  } catch (error) {
    handleError(res, error)
  }
}

export async function unsave(req: Request, res: Response) {
  try {
    await unsaveRecipe(req.userId!, req.params.recipeId)
    res.json({ success: true })
  } catch (error) {
    handleError(res, error)
  }
}