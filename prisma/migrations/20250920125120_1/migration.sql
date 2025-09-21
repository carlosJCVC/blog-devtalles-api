-- CreateEnum
CREATE TYPE "public"."post_status" AS ENUM ('draft', 'published', 'archived', 'scheduled');

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "status" "public"."post_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ,
    "scheduled_at" TIMESTAMPTZ,
    "author_id" INTEGER NOT NULL,
    "featured_image_url" VARCHAR(500),
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "public"."posts"("slug");

-- CreateIndex
CREATE INDEX "idx_posts_status_published" ON "public"."posts"("status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_posts_author" ON "public"."posts"("author_id");

-- CreateIndex
CREATE INDEX "idx_posts_slug" ON "public"."posts"("slug");

-- CreateIndex
CREATE INDEX "idx_posts_created" ON "public"."posts"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_posts_views" ON "public"."posts"("views_count" DESC);
