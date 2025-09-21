import { PostStatus as PrismaPostStatus, Prisma } from '@prisma/client';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostResponseDto } from '../dtos/responses/post.response.dto';
import { PostStatus } from '../../domain/enums/post-status.enum';

export class PostMapper {
  /**
   * Maps an AgreementDto to a Domain Agreement model.
   * @param dto - The DTO object received from the API.
   * @returns A Domain model object representing an Agreement.
   */
  static fromEntity(post: PostEntity): PostResponseDto {
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
    const status = prismaPost.status as PrismaPostStatus;
    const featuredImageUrl = prismaPost.featured_image_url
      ? prismaPost.featured_image_url
      : undefined;

    const post = PostEntity.reconstitute({
      id: prismaPost.id,
      title: prismaPost.title,
      content: prismaPost.content,
      slug: prismaPost.slug,
      authorId: prismaPost.author_id,
      status: 'SCHEDULED' as PostStatus,
      publishedAt: parseDate(prismaPost.published_at),
      scheduledAt: parseDate(prismaPost.scheduled_at),
      featuredImageUrl: featuredImageUrl,
      viewsCount: prismaPost.views_count ? prismaPost.views_count : 0,
      likesCount: prismaPost.likes_count ? prismaPost.likes_count : 0,
      commentsCount: prismaPost.comments_count ? prismaPost.comments_count : 0,
      allowComments: true,
      createdAt: parseDate(prismaPost.created_at) ?? new Date(),
      updatedAt: parseDate(prismaPost.updated_at) ?? new Date(),
      deletedAt: parseDate(prismaPost.deleted_at),
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
      author_id: post.authorId,

      published_at: post.publishedAt,
      scheduled_at: post.scheduledAt,
      featured_image_url: post.featuredImageUrl,
      views_count: post.viewsCount,
      likes_count: post.likesCount,
      comments_count: post.likesCount,
      // allow_comments: post.allowComments,
    };
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
