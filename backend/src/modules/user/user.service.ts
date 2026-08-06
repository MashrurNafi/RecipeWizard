import { prisma } from "../../lib/prisma"

export interface UserProfileUpdate {
  firstName?: string
  lastName?: string
  imageUrl?: string
}

export async function upsertUser(clerkId: string, email?: string) {
  return prisma.user.upsert({
    where: { id: clerkId },
    update: {},
    create: { id: clerkId, email: email ?? null },
  })
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } })
}

export async function updateProfile(userId: string, data: UserProfileUpdate) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
    },
  })
}