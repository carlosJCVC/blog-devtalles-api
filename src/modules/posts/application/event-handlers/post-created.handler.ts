import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { EventHandler } from '@src/common/domain/events/event-handler.interface';

@Injectable()
export class PostCreatedHandler implements EventHandler<PostCreatedEvent> {
  private readonly logger = new Logger(PostCreatedHandler.name);

  @OnEvent('post.created')
  async handle(event: PostCreatedEvent): Promise<void> {
    this.logger.log(
      `Handling PostCreated event for post: ${event.aggregateId}`,
      {
        postId: event.aggregateId,
        title: event.title,
        slug: event.slug,
        authorId: event.authorId,
      },
    );

    try {
      await this.sendWelcomeNotificationToAuthor(event);
      await this.updateAuthorStatistics(event);
      await this.indexPostForSearch(event);

      this.logger.log(
        `PostCreated event processed successfully for post: ${event.aggregateId}`,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(
        `Failed to handle PostCreated event for post: ${event.aggregateId}`,
        error.stack,
      );
      // Don't rethrow - we don't want to break the main flow
      // In production, you might want to send this to a dead letter queue
    }
  }

  private async sendWelcomeNotificationToAuthor(
    event: PostCreatedEvent,
  ): Promise<void> {
    // TODO: Integrate with notification service
    this.logger.debug(
      `Would send welcome notification to author: ${event.authorId}`,
    );

    return new Promise(() => {});
  }

  private async updateAuthorStatistics(event: PostCreatedEvent): Promise<void> {
    // TODO: Update author's post count, etc.
    this.logger.debug(`Would update statistics for author: ${event.authorId}`);

    return new Promise(() => {});
  }

  private async indexPostForSearch(event: PostCreatedEvent): Promise<void> {
    // TODO: Index post in search engine (Elasticsearch, etc.)
    this.logger.debug(`Would index post for search: ${event.slug}`);

    return new Promise(() => {});
  }
}
