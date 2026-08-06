import { Request, Response, NextFunction } from "express"
import { verifyToken } from "@clerk/backend"
import { prisma } from "../lib/prisma"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

function extractEmail(payload: Record<string, unknown>): string | undefined {
  const email = payload.email
  return typeof email === "string" ? email : undefined
}

async function syncUser(clerkId: string, email?: string) {
  await prisma.user.upsert({
    where: { id: clerkId },
    update: {},
    create: { id: clerkId, email: email ?? null },
  })
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
    await syncUser(payload.sub, extractEmail(payload as Record<string, unknown>))
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
    await syncUser(payload.sub, extractEmail(payload as Record<string, unknown>))
  } catch {
    // ignore invalid tokens
  }
  next()
}
