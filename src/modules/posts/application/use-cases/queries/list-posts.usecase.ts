import { Inject, Injectable, Logger } from '@nestjs/common';
import type {
  PaginatedResponse,
  PostsRepositoryInterface,
  QueryOptions,
} from '@src/modules/posts/domain/repositories';
import { PostQuery } from '../../validation';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';

@Injectable()
export class ListPostsUseCase {
  private readonly logger = new Logger(ListPostsUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
  ) {}

  async execute(query: PostQuery): Promise<PaginatedResponse<PostEntity>> {
    this.logger.log(`Listing posts with query: ${JSON.stringify(query)}`);

    try {
      const options: QueryOptions = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      };

      // Apply different filtering strategies based on query parameters
      if (query.status) {
        return await this.postsRepository.findByStatus(query.status, options);
      }

      if (query.authorId) {
        return await this.postsRepository.findByAuthor(query.authorId, options);
      }

      if (query.categoryId) {
        return await this.postsRepository.findByCategory(
          query.categoryId,
          options,
        );
      }

      // Default: get published posts with filters
      const filters = this.buildFilters(query);
      return await this.getFilteredPosts(filters, options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Failed to list posts: ${error.message}`, error.stack);

      throw error;
    }
  }

  private buildFilters(query: PostQuery): any {
    const filters: any = {};

    if (query.dateFrom || query.dateTo) {
      filters.dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
      filters.dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
    }

    return filters;
  }

  private async getFilteredPosts(
    filters: any,
    options: QueryOptions,
  ): Promise<PaginatedResponse<PostEntity>> {
    // This would be implemented in the repository
    // For now, default to published posts
    return await this.postsRepository.findPublished(options);
  }
}
