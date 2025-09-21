import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  PaginatedResponse,
  PopularityOptions,
  PostFilters,
  PostsRepositoryInterface,
  QueryOptions,
  SearchOptions,
} from '../../domain/repositories';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostStatus, PostStatusVO } from '../../domain/enums/post-status.enum';
import { PrismaService } from '@src/database/prisma.service';
import { PostMapper } from '../../application/mappers/post.mapper';
import { SortFieldTransformer } from '../transformers/sort-field.transformer';
import { toError } from '@src/common/errors/to-error';

@Injectable()
export class PrismaPostsRepository implements PostsRepositoryInterface {
  private readonly logger = new Logger(PrismaPostsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(post: PostEntity): Promise<PostEntity> {
    try {
      const data = PostMapper.toCreateInput(post);

      // Create new post
      const savedPost = await this.prisma.post.create({
        data: {
          ...data,
          id: post.id,
        },
        // include: this.getIncludeOptions(),
      });

      return PostMapper.fromPrisma(savedPost);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Failed to save post: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<PostEntity | null> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id,
          deletedAt: null, // Only non-deleted posts
        },
        // include: this.getIncludeOptions(),
      });

      return post ? PostMapper.fromPrisma(post) : null;
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find post by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          slug,
          deletedAt: null,
        },
        // include: this.getIncludeOptions(),
      });

      return post ? PostMapper.fromPrisma(post) : null;
    } catch (err) {
      const error = toError(err);

      this.logger.error(
        `Failed to find post by slug: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByStatus(
    status: PostStatus,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = options || {};
      const skip = (page - 1) * limit;

      const dbSortField = SortFieldTransformer.transformSortField(sortBy);

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: {
            status: PostStatusVO.create(status).toPrismaValue(),
            deletedAt: null,
          },
          // include: this.getIncludeOptions() as never,
          orderBy: { [dbSortField]: sortOrder.toLowerCase() },
          skip,
          take: limit,
        }),
        this.prisma.post.count({
          where: {
            status: PostStatusVO.create(status).toPrismaValue(),
            deletedAt: null,
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);
      return {
        data: posts.map((post) => PostMapper.fromPrisma(post)),
        meta: {
          total: total | 0,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to find posts by status: ${error.message}`,
        error.stack,
      );

      throw error;
    }
  }

  findPublished(
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.findByStatus(PostStatus.PUBLISHED, options);
  }

  findDrafts(
    authorId?: string,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>> {
    throw new Error('Method not implemented.');
  }

  findScheduled(): Promise<PostEntity[]> {
    throw new Error('Method not implemented.');
  }

  async findByAuthor(
    authorId: number,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
      } = options || {};
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: {
            authorId: authorId,
            deletedAt: null,
          },
          // include: {
          //   postCategories: {
          //     include: {
          //       category: true,
          //     },
          //   },
          //   postTags: {
          //     include: {
          //       tag: true,
          //     },
          //   },
          // },
          orderBy: { [sortBy]: sortOrder.toLowerCase() },
          skip,
          take: limit,
        }),
        this.prisma.post.count({
          where: {
            authorId: authorId,
            deletedAt: null,
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: posts.map((post) => PostMapper.fromPrisma(post)),
        meta: {
          total: total | 0,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find posts by author: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  countByAuthor(authorId: number): Promise<number> {
    throw new Error('Method not implemented.');
  }

  countByAuthorAndStatus(
    authorId: number,
    status: PostStatus,
  ): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async findByCategory(
    categoryId: number,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'published_at',
        sortOrder = 'DESC',
      } = options || {};
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: {
            postCategories: {
              some: { categoryId: categoryId },
            },
            status: 'PUBLISHED',
            deletedAt: null,
          },
          // include: this.getIncludeOptions(),
          orderBy: { [sortBy]: sortOrder.toLowerCase() },
          skip,
          take: limit,
        }),
        this.prisma.post.count({
          where: {
            postCategories: {
              some: { categoryId: categoryId },
            },
            status: 'PUBLISHED',
            deletedAt: null,
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: posts.map((post) => PostMapper.fromPrisma(post)),
        meta: {
          total: total | 0,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find posts by category: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async search(
    query: string,
    options: SearchOptions = {},
  ): Promise<PaginatedResponse<PostEntity>> {
    try {
      const {
        page = 1,
        limit = 10,
        searchFields = ['title', 'content'],
      } = options;
      const skip = (page - 1) * limit;

      const searchConditions: any = [];

      if (searchFields.includes('title')) {
        searchConditions.push({
          title: { contains: query, mode: 'insensitive' as any },
        });
      }

      if (searchFields.includes('content')) {
        searchConditions.push({
          content: { contains: query, mode: 'insensitive' as any },
        });
      }

      const whereCondition = {
        OR: searchConditions,
        status: PostStatus.PUBLISHED,
        deletedAt: null,
      };

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: whereCondition,
          // include: this.getIncludeOptions(),
          orderBy: { publishedAt: 'desc' },
          skip: skip,
          take: limit,
        }),
        this.prisma.post.count({ where: whereCondition }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: posts.map((post) => PostMapper.fromPrisma(post)),
        meta: {
          total: total | 0,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(`Failed to search tags: ${error.message}`, error.stack);

      throw error;
    }
  }

  async findSimilar(postId: number, limit?: number): Promise<PostEntity[]> {
    try {
      const currentPost = await this.prisma.post.findUnique({
        where: { id: postId },
        // include: { post_categories: true, post_tags: true },
      });

      if (!currentPost) return [];

      // const categoryIds = currentPost.post_categories.map(
      //   (pc) => pc.category_id,
      // );
      // const tagIds = currentPost.post_tags.map((pt) => pt.tag_id);

      const posts = await this.prisma.post.findMany({
        where: {
          AND: [
            { id: { not: postId } },
            { status: PostStatus.PUBLISHED },
            { deletedAt: null },
            // {
            //   OR: [
            //     {
            //       post_categories: {
            //         some: { category_id: { in: categoryIds } },
            //       },
            //     },
            //     { post_tags: { some: { tag_id: { in: tagIds } } } },
            //   ],
            // },
          ],
        },
        // include: this.getIncludeOptions(),
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      return posts.map((post) => PostMapper.fromPrisma(post));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(
        `Failed to find similar posts: ${error.message}`,
        error.stack,
      );

      throw error;
    }
  }

  findRelated(postId: number, limit?: number): Promise<PostEntity[]> {
    return this.findSimilar(postId, limit);
  }

  async findMostViewed(options?: PopularityOptions): Promise<PostEntity[]> {
    try {
      const { limit = 10, timeframe = 'week', minViews = 0 } = options || {};

      let dateFilter: Prisma.PostWhereInput = {};
      // let dateFilter = {};
      if (timeframe !== 'all') {
        const date = new Date();
        switch (timeframe) {
          case 'day':
            date.setDate(date.getDate() - 1);
            break;
          case 'week':
            date.setDate(date.getDate() - 7);
            break;
          case 'month':
            date.setMonth(date.getMonth() - 1);
            break;
          case 'year':
            date.setFullYear(date.getFullYear() - 1);
            break;
        }
        dateFilter = { publishedAt: { gte: date } };
      }

      const posts = await this.prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
          viewsCount: { gte: minViews },
          ...dateFilter,
        },
        // include: this.getIncludeOptions(),
        orderBy: { viewsCount: 'desc' },
        take: limit,
      });

      return posts.map((post) => PostMapper.fromPrisma(post));
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find most viewed posts: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  findMostLiked(options?: PopularityOptions): Promise<PostEntity[]> {
    throw new Error('Method not implemented.');
  }

  async update(post: PostEntity): Promise<boolean> {
    try {
      if (!post.id) {
        throw new NotFoundException(`Post ${post.id} not found`);
      }

      const exists = await this.exists(post.id ?? 0);
      if (!exists) {
        throw new NotFoundException(`Post ${post.id} not found`);
      }

      const data = PostMapper.toUpdateInput(post);

      // Create new post
      await this.prisma.post.update({
        where: { id: post.id },
        data: data,
      });

      return true;
    } catch (err) {
      const error = toError(err);
      this.logger.error(`Failed to update post: ${error.message}`, error.stack);
      throw error;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const count = await this.prisma.post.count({
        where: {
          id,
          deletedAt: null,
        },
      });
      return count > 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to check if post exists: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async existsBySlug(slug: string, excludeId?: number): Promise<boolean> {
    try {
      const where: any = {
        slug,
        deletedAt: null,
      };

      if (excludeId) {
        where.id = { not: excludeId };
      }

      const count = await this.prisma.post.count({ where });

      return count > 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to check if post slug exists: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  count(filters?: PostFilters): Promise<number> {
    throw new Error('Method not implemented.');
  }

  bulkUpdateStatus(ids: number[], status: PostStatus): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  bulkDelete(ids: number[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  softDelete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getIncludeOptions() {
    return {
      post_categories: {
        include: {
          category: true,
        },
      },
      post_tags: {
        include: {
          tag: true,
        },
      },
    };
  }
}
