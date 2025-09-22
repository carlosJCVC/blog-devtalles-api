-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MODERATOR', 'AUTHOR', 'USER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatar" VARCHAR(500),
    "bio" TEXT,
    "discord_id" VARCHAR(100),
    "email_verified_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "refresh_token" VARCHAR(255),
    "refresh_token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "public"."users"("discord_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_refresh_token_idx" ON "public"."users"("refresh_token");

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
