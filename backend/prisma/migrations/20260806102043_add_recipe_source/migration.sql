-- CreateEnum
CREATE TYPE "RecipeSource" AS ENUM ('AI', 'MANUAL');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "source" "RecipeSource" NOT NULL DEFAULT 'AI';
