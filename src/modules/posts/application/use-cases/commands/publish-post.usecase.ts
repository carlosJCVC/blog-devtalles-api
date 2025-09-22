import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { PostsRepositoryInterface } from '@src/modules/posts/domain/repositories';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';
import { PostValidator, PublishPostPayload } from '../../validation';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import { PostEntity } from '@src/modules/posts/domain/entities/post.entity';
import { PostNotFoundException } from '@src/modules/posts/domain/exceptions';
import { toError } from '@src/common/errors/to-error';

@Injectable()
export class PublishPostUseCase {
  private readonly logger = new Logger(PublishPostUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,
    private readonly postValidator: PostValidator,

    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    postId: number,
    payload: PublishPostPayload = {},
  ): Promise<PostEntity> {
    this.logger.log(`Publishing post: ${postId}`);

    try {
      const post = await this.postsRepository.findById(postId);
      if (!post) {
        throw new PostNotFoundException(postId);
      }

      this.validatePostForPublication(post);

      if (payload.scheduledAt) {
        const scheduleDate = new Date(payload.scheduledAt);
        this.postValidator.validateScheduleDate(scheduleDate);
        post.schedule(scheduleDate);
        this.logger.log(`Post scheduled for: ${scheduleDate.toISOString()}`);
      } else {
        post.publish();
        this.logger.log(`Post published immediately`);
      }

      const publishedPost = await this.postsRepository.create(post);

      await this.publishDomainEvents(publishedPost);

      return publishedPost;
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to publish post: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private validatePostForPublication(post: PostEntity): void {
    if (!post.canBePublished()) {
      throw new BadRequestException(
        `Cannot publish post with status: ${post.status}`,
      );
    }

    // Additional publication validations
    this.postValidator.validateForPublication(post.content, post.title);
  }

  private async publishDomainEvents(post: PostEntity): Promise<void> {
    const events = post.domainEvents;

    for (const event of events) {
      await this.eventBus.publish(event);
    }

    post.clearDomainEvents();
  }
}
