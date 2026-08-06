import { Request, Response } from "express"
import { HttpError, handleError } from "../../lib/httpError"
import {
  createRecipe,
  deleteRecipe,
  getPublicRecipes,
  getRecipeById,
  getUserRecipes,
  updateRecipe,
} from "./recipe.service"

export async function getPublic(_req: Request, res: Response) {
  try {
    const recipes = await getPublicRecipes()
    res.json({ recipes })
  } catch (error) {
    handleError(res, error)
  }
}

export async function getMine(req: Request, res: Response) {
  try {
    const recipes = await getUserRecipes(req.userId!)
    res.json({ recipes })
  } catch (error) {
    handleError(res, error)
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const recipe = await getRecipeById(req.params.id)
    if (!recipe) throw new HttpError(404, "Recipe not found")
    res.json({ recipe })
  } catch (error) {
    handleError(res, error)
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { title, servings, timeMinutes, ingredients, steps, cuisine, dietary, isPublic } = req.body

    if (!title || typeof title !== "string") throw new HttpError(400, "Title is required")
    if (!Number.isInteger(servings) || servings <= 0) throw new HttpError(400, "Servings must be a positive integer")
    if (!Number.isInteger(timeMinutes) || timeMinutes <= 0) throw new HttpError(400, "TimeMinutes must be a positive integer")
    if (!Array.isArray(ingredients) || ingredients.length === 0) throw new HttpError(400, "At least one ingredient is required")
    if (!Array.isArray(steps) || steps.length === 0) throw new HttpError(400, "At least one step is required")

    const recipe = await createRecipe(req.userId!, {
      title,
      servings,
      timeMinutes,
      ingredients,
      steps,
      cuisine: cuisine ?? null,
      dietary: Array.isArray(dietary) ? dietary : [],
      isPublic: typeof isPublic === "boolean" ? isPublic : true,
    })

    res.status(201).json({ recipe })
  } catch (error) {
    handleError(res, error)
  }
}

export async function update(req: Request, res: Response) {
  try {
    const recipe = await updateRecipe(req.params.id, req.userId!, req.body)
    res.json({ recipe })
  } catch (error) {
    handleError(res, error)
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await deleteRecipe(req.params.id, req.userId!)
    res.json({ success: true })
  } catch (error) {
    handleError(res, error)
  }
}