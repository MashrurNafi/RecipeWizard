import { Request, Response, NextFunction } from "express"
import { verifyToken } from "@clerk/backend"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  try {
    const payload = await verifyToken(header.slice(7), {
      secretKey: process.env.CLERK_SECRET_KEY,
    })
    req.userId = payload.sub
    next()
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    next()
    return
  }

  try {
    const payload = await verifyToken(header.slice(7), {
      secretKey: process.env.CLERK_SECRET_KEY,
    })
    req.userId = payload.sub
  } catch {
    // ignore invalid tokens
  }
  next()
}
