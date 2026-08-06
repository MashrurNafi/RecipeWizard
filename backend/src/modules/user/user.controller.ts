import { Request, Response } from "express"
import { HttpError, handleError } from "../../lib/httpError"
import { getUserById, updateProfile, upsertUser } from "./user.service"

export async function getMe(req: Request, res: Response) {
  try {
    let user = await getUserById(req.userId!)
    if (!user) user = await upsertUser(req.userId!)
    res.json({ user })
  } catch (error) {
    handleError(res, error)
  }
}

export async function updateMe(req: Request, res: Response) {
  try {
    const { firstName, lastName, imageUrl } = req.body

    const user = await updateProfile(req.userId!, {
      ...(firstName !== undefined ? { firstName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
    })

    res.json({ user })
  } catch (error) {
    if (error instanceof HttpError) {
      handleError(res, error)
      return
    }
    handleError(res, new HttpError(400, "Invalid profile data"))
  }
}