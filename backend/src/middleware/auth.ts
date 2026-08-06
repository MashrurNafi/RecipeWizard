import { Request, Response, NextFunction } from "express"
import { verifyToken, createClerkClient } from "@clerk/backend"
import { prisma } from "../lib/prisma"

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

async function syncUser(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { id: clerkId } })
  if (existing?.firstName && existing?.imageUrl) {
    return existing
  }

  let email: string | null = null
  let firstName: string | null = null
  let lastName: string | null = null
  let imageUrl: string | null = null

  try {
    const clerkUser = await clerkClient.users.getUser(clerkId)
    firstName = clerkUser.firstName ?? null
    lastName = clerkUser.lastName ?? null
    imageUrl = clerkUser.imageUrl ?? null
    email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress ?? null
  } catch {
    // user may not exist in Clerk (e.g. seed users); leave fields null
  }

  return prisma.user.upsert({
    where: { id: clerkId },
    update: {
      ...(email !== null ? { email } : {}),
      ...(firstName !== null ? { firstName } : {}),
      ...(lastName !== null ? { lastName } : {}),
      ...(imageUrl !== null ? { imageUrl } : {}),
    },
    create: {
      id: clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
    },
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
    await syncUser(payload.sub)
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
    await syncUser(payload.sub)
  } catch {
    // ignore invalid tokens
  }
  next()
}
