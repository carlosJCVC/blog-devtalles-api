import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
import { PostNotFoundException } from '@src/modules/posts/domain/exceptions';
import type { PostsRepositoryInterface } from '@src/modules/posts/domain/repositories';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';

@Injectable()
export class GetRelatedPostsUseCase {
  private readonly logger = new Logger(GetRelatedPostsUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
  ) {}

  async execute(postId: number, limit: number = 5): Promise<PostEntity[]> {
    this.logger.log(`Getting related posts for: ${postId}`);

    try {
      // Verify the post exists
      const post = await this.postsRepository.findById(postId);
      if (!post) {
        throw new PostNotFoundException(postId);
      }

      // Get related posts using repository method
      const relatedPosts = await this.postsRepository.findRelated(
        postId,
        limit,
      );

      this.logger.log(`Found ${relatedPosts.length} related posts`);
      return relatedPosts;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to get related posts: ${error.message}`,
        error.stack,
      );

      throw error;
    }
  }
}
