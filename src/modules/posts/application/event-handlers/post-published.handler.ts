import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostPublishedEvent } from '../../domain/events/post-published.event';
import { EventHandler } from '@src/common/domain/events/event-handler.interface';

@Injectable()
export class PostPublishedHandler implements EventHandler<PostPublishedEvent> {
  private readonly logger = new Logger(PostPublishedHandler.name);

  @OnEvent('post.published')
  async handle(event: PostPublishedEvent): Promise<void> {
    this.logger.log(
      `Handling PostPublished event for post: ${event.aggregateId}`,
      {
        postId: event.aggregateId,
        title: event.title,
        slug: event.slug,
        publishedAt: event.publishedAt,
      },
    );

    try {
      // Example actions when a post is published:
      await this.sendPublicationNotifications(event);
      await this.updateCategoryStatistics(event);
      await this.updateTagStatistics(event);
      await this.notifySocialMedia(event);
      await this.generateSitemap(event);

      this.logger.log(
        `PostPublished event processed successfully for post: ${event.aggregateId}`,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(
        `Failed to handle PostPublished event for post: ${event.aggregateId}`,
        error.stack,
      );
    }
  }

  private async sendPublicationNotifications(
    event: PostPublishedEvent,
  ): Promise<void> {
    // TODO: Send notifications to subscribers
    this.logger.debug(
      `Would send publication notifications for post: ${event.slug}`,
    );

    return new Promise(() => {});
  }

  private async updateCategoryStatistics(
    event: PostPublishedEvent,
  ): Promise<void> {
    // TODO: Update post count for categories
    this.logger.debug(
      `Would update category statistics for categories: ${event.categoryIds.join(', ')}`,
    );

    return new Promise(() => {});
  }

  private async updateTagStatistics(event: PostPublishedEvent): Promise<void> {
    // TODO: Increment usage count for tags
    this.logger.debug(
      `Would update tag statistics for tags: ${event.tagIds.join(', ')}`,
    );

    return new Promise(() => {});
  }

  private async notifySocialMedia(event: PostPublishedEvent): Promise<void> {
    // TODO: Auto-post to social media
    this.logger.debug(`Would notify social media for post: ${event.slug}`);

    return new Promise(() => {});
  }

  private async generateSitemap(event: PostPublishedEvent): Promise<void> {
    // TODO: Update sitemap.xml
    this.logger.debug(`Would update sitemap for post: ${event.slug}`);

    return new Promise(() => {});
  }
}
