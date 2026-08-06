import { Response } from "express"

export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function handleError(res: Response, error: unknown) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message })
    return
  }
  console.error(error)
  res.status(500).json({ error: "Internal server error" })
}