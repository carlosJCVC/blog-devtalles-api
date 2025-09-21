import {
  PaginatedResponse,
  PopularityOptions,
  PostFilters,
  QueryOptions,
  SearchOptions,
} from '@src/common/repositories/types/query-options.type';
import { PostEntity } from '../entities/post.entity';
import { PostStatus } from '../enums/post-status.enum';

export const POSTS_REPOSITORY_TOKEN = 'PostsRepositoryInterface';

export interface PostsRepositoryInterface {
  // CRUD
  create(post: PostEntity): Promise<PostEntity>;

  findById(id: number): Promise<PostEntity | null>;

  findBySlug(slug: string): Promise<PostEntity | null>;

  findByStatus(
    status: PostStatus,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>>;

  findPublished(options?: QueryOptions): Promise<PaginatedResponse<PostEntity>>;

  findDrafts(
    authorId?: string,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>>;

  findScheduled(): Promise<PostEntity[]>;

  findByAuthor(
    authorId: string,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>>;

  countByAuthor(authorId: string): Promise<number>;

  countByAuthorAndStatus(authorId: string, status: PostStatus): Promise<number>;

  findByCategory(
    categoryId: string,
    options?: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>>;

  search(
    query: string,
    options?: SearchOptions,
  ): Promise<PaginatedResponse<PostEntity>>;

  findSimilar(postId: number, limit?: number): Promise<PostEntity[]>;

  findRelated(postId: number, limit?: number): Promise<PostEntity[]>;

  findMostViewed(options?: PopularityOptions): Promise<PostEntity[]>;

  findMostLiked(options?: PopularityOptions): Promise<PostEntity[]>;

  exists(id: number): Promise<boolean>;

  existsBySlug(slug: string, excludeId?: string): Promise<boolean>;

  count(filters?: PostFilters): Promise<number>;

  bulkUpdateStatus(ids: string[], status: PostStatus): Promise<void>;

  delete(id: string): Promise<void>;

  bulkDelete(ids: string[]): Promise<void>;

  softDelete(id: string): Promise<void>;
}
