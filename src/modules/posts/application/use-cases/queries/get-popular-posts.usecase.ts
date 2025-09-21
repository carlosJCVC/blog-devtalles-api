import { Inject, Injectable, Logger } from '@nestjs/common';
import type { PostsRepositoryInterface } from '@src/modules/posts/domain/repositories';
import { PopularPostQuery } from '../../validation';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';

@Injectable()
export class GetPopularPostsUseCase {
  private readonly logger = new Logger(GetPopularPostsUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
  ) {}

  async execute(input: PopularPostQuery): Promise<PostEntity[]> {
    this.logger.log(`Getting popular posts: ${JSON.stringify(input)}`);

    try {
      const options = {
        limit: input.limit,
        timeframe: input.timeframe,
        minViews: input.minViews,
      };

      let posts: PostEntity[];

      switch (input.timeframe) {
        case 'day':
        case 'week':
        case 'month':
        case 'year':
          posts = await this.postsRepository.findMostViewed(options);
          break;
        case 'all':
        default:
          posts = await this.postsRepository.findMostViewed(options);
          break;
      }

      this.logger.log(`Found ${posts.length} popular posts`);
      return posts;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to get popular posts: ${error.message}`,
        error.stack,
      );

      throw error;
    }
  }
}
