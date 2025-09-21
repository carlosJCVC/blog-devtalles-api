import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostViewedEvent } from '../../domain/events/post-viewed.event';
import { EventHandler } from '@src/common/domain/events/event-handler.interface';

@Injectable()
export class PostViewedHandler implements EventHandler<PostViewedEvent> {
  private readonly logger = new Logger(PostViewedHandler.name);

  @OnEvent('post.viewed')
  async handle(event: PostViewedEvent): Promise<void> {
    this.logger.debug(
      `Handling PostViewed event for post: ${event.aggregateId}`,
      {
        postId: event.aggregateId,
        slug: event.slug,
        isAuthenticated: event.isAuthenticatedView(),
        isUnique: event.isUniqueView,
      },
    );

    try {
      // Example analytics actions:
      await this.recordAnalytics(event);
      await this.updatePopularityScore(event);

      if (event.isUniqueView) {
        await this.updateUniqueViewsCount(event);
      }

      this.logger.debug(
        `PostViewed event processed successfully for post: ${event.aggregateId}`,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(
        `Failed to handle PostViewed event for post: ${event.aggregateId}`,
        error.stack,
      );
    }
  }

  private async recordAnalytics(event: PostViewedEvent): Promise<void> {
    // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
    this.logger.debug(`Would record analytics for post view: ${event.slug}`);

    return new Promise(() => {});
  }

  private async updatePopularityScore(event: PostViewedEvent): Promise<void> {
    // TODO: Update post popularity algorithm
    this.logger.debug(`Would update popularity score for post: ${event.slug}`);

    return new Promise(() => {});
  }

  private async updateUniqueViewsCount(event: PostViewedEvent): Promise<void> {
    // TODO: Update unique views counter
    this.logger.debug(`Would update unique views for post: ${event.slug}`);

    return new Promise(() => {});
  }
}
