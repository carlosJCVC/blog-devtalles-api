import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePostPayload, PostValidator } from '../../validation';
import {
  POSTS_REPOSITORY_TOKEN,
  type PostsRepositoryInterface,
} from '@src/modules/posts/domain/repositories/posts.repository.interface';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';

@Injectable()
export class CreatePostUseCase {
  private readonly logger = new Logger(CreatePostUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
    private readonly postValidator: PostValidator,
  ) {}

  async execute(
    payload: CreatePostPayload,
    authorId: number,
  ): Promise<PostEntity> {
    this.logger.log(
      `Creating post: "${payload.title}" for author: ${authorId}`,
    );

    try {
      const post = PostEntity.create(
        payload.title,
        payload.content,
        authorId,
        payload.slug,
      );

      this.setOptionalFields(post, payload);

      await this.postValidator.validateSlugUniqueness(post.slug);

      const savedPost = await this.postsRepository.create(post);

      // TRIGGER EVENTS HERE

      this.logger.log(`Post created successfully: ${savedPost.id}`);
      return savedPost;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(`Failed to create post: ${error.message}`, error.stack);

      throw error;
    }
  }

  private setOptionalFields(
    post: PostEntity,
    payload: CreatePostPayload,
  ): void {
    if (payload.featuredImageUrl) {
      post.setFeaturedImage(payload.featuredImageUrl);
    }

    if (payload.allowComments !== undefined) {
      if (payload.allowComments) {
        // allowComments is true by default, so nothing to do
      } else {
        post.toggleComments(); // Turn off comments
      }
    }
  }
}
