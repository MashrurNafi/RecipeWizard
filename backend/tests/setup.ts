import { vi } from "vitest"
import { createPrismaMock } from "./helpers/prismaMock"

export const mockPrisma = createPrismaMock().prisma
export const mockGroqCreate = vi.fn()

vi.mock("../src/lib/prisma", () => ({ prisma: mockPrisma }))
vi.mock("../src/middleware/auth", () => ({
  requireAuth: (req: { userId?: string }, _res: unknown, next: () => void) => {
    req.userId = "user-1"
    next()
  },
  optionalAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}))
vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = { completions: { create: mockGroqCreate } }
  },
}))
