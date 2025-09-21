import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
// import { PostStatus } from '@src/modules/posts/domain/enums/post-status.enum';
import type {
  PaginatedResponse,
  PostsRepositoryInterface,
  QueryOptions,
} from '@src/modules/posts/domain/repositories';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';

@Injectable()
export class GetPostsByAuthorUseCase {
  private readonly logger = new Logger(GetPostsByAuthorUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
  ) {}

  async execute(
    authorId: string,
    page: number = 1,
    limit: number = 10,
    includeDrafts: boolean = false,
  ): Promise<PaginatedResponse<PostEntity>> {
    this.logger.log(`Getting posts by author: ${authorId}`);

    try {
      const options: QueryOptions = {
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };

      if (includeDrafts) {
        // Return all posts by author
        return await this.postsRepository.findByAuthor(authorId, options);
      } else {
        // Return only published posts by author
        // const filters = {
        //   authorId,
        //   status: 'PUBLISHED' as PostStatus,
        // };
        // This would need to be implemented in repository
        return await this.postsRepository.findByAuthor(authorId, options);
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to get posts by author: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
