import { Prisma } from '@prisma/client';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostDto } from '../dtos/post.dto';
import { StatusMapper } from './status.mapper';

export class PostMapper {
  /**
   * Maps an PostEntity to PostDto model.
   * @param entity - The Entity.
   * @returns A PostDto object representing an Post.
   */
  static fromEntity(post: PostEntity): PostDto {
    return {
      id: post.id ?? 0,
      title: post.title,
      slug: post.slug,
      content: post.content,
      featuredImageUrl: post.featuredImageUrl,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString(),
      scheduledAt: post.scheduledAt?.toISOString(),
      author: {
        id: post.authorId,
        username: `user_${post.authorId}`,
        fullName: 'Mock Author',
        avatarUrl: 'https://via.placeholder.com/150',
      }, // Mock for now
      categories: post.categoryIds.map((id, index) => ({
        id,
        name: `Category ${index + 1}`,
        slug: `category-${index + 1}`,
        description: `Description for category ${index + 1}`,
        color: '#3B82F6',
        createdAt: new Date(),
        updatedAt: new Date(),
      })), // mock for now
      tags: post.tagIds.map((id, index) => ({
        id,
        name: `Tag ${index + 1}`,
        slug: `tag-${index + 1}`,
        usageCount: Math.floor(Math.random() * 100),
      })), // modcks for now
      viewsCount: post.viewsCount,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      allowComments: post.allowComments,
      readingTimeMinutes: post.readingTimeMinutes,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  static fromPrisma(
    prismaPost: Prisma.PostUncheckedCreateInput & { id: number },
  ): PostEntity {
    const featuredImageUrl = prismaPost.featuredImageUrl
      ? prismaPost.featuredImageUrl
      : undefined;

    const post = PostEntity.reconstitute({
      id: prismaPost.id,
      title: prismaPost.title,
      content: prismaPost.content,
      slug: prismaPost.slug,
      authorId: prismaPost.authorId,
      status: StatusMapper.fromPrisma(prismaPost.status),
      publishedAt: parseDate(prismaPost.publishedAt),
      scheduledAt: parseDate(prismaPost.scheduledAt),
      featuredImageUrl: featuredImageUrl,
      viewsCount: prismaPost.viewsCount ? prismaPost.viewsCount : 0,
      likesCount: prismaPost.likesCount ? prismaPost.likesCount : 0,
      commentsCount: prismaPost.commentsCount ? prismaPost.commentsCount : 0,
      allowComments: true,
      createdAt: parseDate(prismaPost.createdAt) ?? new Date(),
      updatedAt: parseDate(prismaPost.updatedAt) ?? new Date(),
      deletedAt: parseDate(prismaPost.deletedAt),
    });

    // Map categories and tags
    // if (prismaPost.post_categories) {
    //   const categoryIds = prismaPost.post_categories.map(
    //     (pc: any) => pc.category_id,
    //   );

    //   post.assignCategories(categoryIds);
    // }

    // if (prismaPost.post_tags) {
    //   const tagIds = prismaPost.post_tags.map((pt: any) => pt.tag_id);
    //   post.assignTags(tagIds);
    // }

    return post;
  }

  static toCreateInput(post: PostEntity): Prisma.PostUncheckedCreateInput {
    return {
      title: post.title,
      slug: post.slug,
      content: post.content,
      status: post.toPrismaStatus,
      authorId: post.authorId,

      publishedAt: post.publishedAt,
      scheduledAt: post.scheduledAt,
      featuredImageUrl: post.featuredImageUrl,
      viewsCount: post.viewsCount,
      likesCount: post.likesCount,
      commentsCount: post.likesCount,
      // allow_comments: post.allowComments,
    };
  }

  static toUpdateInput(entity: PostEntity): Prisma.PostUncheckedUpdateInput {
    const data: Prisma.PostUncheckedUpdateInput = {
      title: entity.title,
      slug: entity.slug,
      content: entity.content,
      status: entity.toPrismaStatus,
      publishedAt: entity.publishedAt,
      scheduledAt: entity.scheduledAt,
      authorId: entity.authorId,
      featuredImageUrl: entity.featuredImageUrl ?? null,
      viewsCount: entity.viewsCount,
      likesCount: entity.likesCount,
      commentsCount: entity.commentsCount,
    };

    return data;
  }
}

const parseDate = (
  date: string | Date | undefined | null,
): Date | undefined => {
  if (date) {
    return new Date(date);
  }

  return undefined;
};
