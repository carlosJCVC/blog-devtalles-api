/*
  Warnings:

  - You are about to drop the column `is_featured` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."posts" DROP COLUMN "is_featured",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT true;
