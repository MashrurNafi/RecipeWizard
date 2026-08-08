import { describe, it, expect, beforeEach, vi } from "vitest"
import { mockPrisma } from "./setup"

import { getUserById, updateProfile, upsertUser } from "../src/modules/user/user.service"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("upsertUser", () => {
  it("upserts the user", async () => {
    mockPrisma.user.upsert.mockResolvedValue({ id: "user-1", email: "a@b.com" })

    const user = await upsertUser("user-1", "a@b.com")

    expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
      where: { id: "user-1" },
      update: {},
      create: { id: "user-1", email: "a@b.com" },
    })
    expect(user.id).toBe("user-1")
  })
})

describe("getUserById", () => {
  it("returns the user", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1", email: "a@b.com" })

    const user = await getUserById("user-1")

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "user-1" } })
    expect(user?.email).toBe("a@b.com")
  })
})

describe("updateProfile", () => {
  it("updates only the provided fields", async () => {
    mockPrisma.user.update.mockResolvedValue({ id: "user-1", firstName: "New" })

    const user = await updateProfile("user-1", { firstName: "New" })

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { firstName: "New" },
    })
    expect(user.firstName).toBe("New")
  })
})
