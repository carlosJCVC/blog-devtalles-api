import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
import {
  PostViewedEvent,
  ViewerInfo,
} from '@src/modules/posts/domain/events/post-viewed.event';
import { PostNotFoundException } from '@src/modules/posts/domain/exceptions';
import type { PostsRepositoryInterface } from '@src/modules/posts/domain/repositories';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';
import { PostMapper } from '../../mappers/post.mapper';

@Injectable()
export class GetPostUseCase {
  private readonly logger = new Logger(GetPostUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Gets a post by ID or slug
   * @param identifier - Post ID or slug
   * @param incrementViews - Whether to increment view count
   * @param viewerInfo - Information about the viewer (for analytics)
   */
  async execute(
    identifier: string,
    incrementViews: boolean = false,
    viewerInfo?: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<PostEntity> {
    this.logger.log(`Getting post by identifier: ${identifier}`);

    try {
      // Try to find by ID first, then by slug
      let post;
      if (typeof identifier === 'number') {
        const id = Number(identifier);
        post = await this.postsRepository.findById(id);
      } else {
        post = await this.postsRepository.findBySlug(identifier);
      }

      if (!post) {
        throw new PostNotFoundException(identifier);
      }

      const postEntity = PostMapper.fromPrisma(post);

      // Increment views if requested (typically for public views)
      if (incrementViews) {
        await this.handleViewIncrement(postEntity, viewerInfo);
      }

      return postEntity;
    } catch (err) {
      if (err instanceof PostNotFoundException) {
        throw err;
      }

      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Failed to get post: ${error.message}`, error.stack);

      throw error;
    }
  }

  private async handleViewIncrement(
    post: PostEntity,
    viewerInfo?: any,
  ): Promise<void> {
    // Increment view count in domain entity
    post.incrementViews();

    // Save updated post
    await this.postsRepository.create(post);

    // Emit view event for analytics
    // PostViewedEvent HERE with viewer info

    // await this.eventBus.publish(viewEvent);
  }
}
