import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import { toError } from '@src/common/errors/to-error';
import { PostDeletedEvent } from '@src/modules/posts/domain/events/post-deleted.event';
import { PostNotFoundException } from '@src/modules/posts/domain/exceptions';
import type { PostsRepositoryInterface } from '@src/modules/posts/domain/repositories';
import { POSTS_REPOSITORY_TOKEN } from '@src/modules/posts/domain/repositories/posts.repository.interface';

@Injectable()
export class DeletePostUseCase {
  private readonly logger = new Logger(DeletePostUseCase.name);

  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,

    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    postId: number,
    deletedBy: number,
    hardDelete: boolean = false,
  ): Promise<void> {
    this.logger.log(`Deleting post: ${postId}, hardDelete: ${hardDelete}`);

    try {
      const post = await this.postsRepository.findById(postId);
      if (!post) {
        throw new PostNotFoundException(postId);
      }

      const deleteEvent = new PostDeletedEvent(
        post.id ?? 0,
        post.title,
        post.slug,
        post.authorId,
        deletedBy,
        hardDelete,
      );

      if (hardDelete) {
        await this.postsRepository.delete(postId);
      } else {
        await this.postsRepository.softDelete(postId);
      }

      await this.eventBus.publish(deleteEvent);

      this.logger.log(`Post deleted successfully: ${postId}`);
    } catch (err) {
      const error = toError(err);
      this.logger.error(`Failed to delete post: ${error.message}`, error.stack);
      throw error;
    }
  }
}
