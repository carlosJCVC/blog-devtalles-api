import { Inject, Injectable, Logger } from '@nestjs/common';
import type {
  PaginatedResponse,
  PostsRepositoryInterface,
} from '@src/modules/posts/domain/repositories';
import { SearchPostQuery } from '../../validation';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';

@Injectable()
export class SearchPostsUseCase {
  private readonly logger = new Logger(SearchPostsUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
  ) {}

  async execute(
    query: SearchPostQuery,
  ): Promise<PaginatedResponse<PostEntity>> {
    this.logger.log(`Searching posts with query: "${query.query}"`);

    try {
      const searchOptions = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        searchFields: query.searchFields,
        filters: query.filters,
      };

      const result = await this.postsRepository.search(
        query.query,
        searchOptions,
      );

      this.logger.log(`Search completed. Found ${result.meta.total} posts`);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(
        `Failed to search posts: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
