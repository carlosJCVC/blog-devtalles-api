import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostScheduledEvent } from '../../domain/events/post-scheduled.event';
import { EventHandler } from '@src/common/domain/events/event-handler.interface';

@Injectable()
export class PostScheduledHandler implements EventHandler<PostScheduledEvent> {
  private readonly logger = new Logger(PostScheduledHandler.name);

  @OnEvent('post.scheduled')
  async handle(event: PostScheduledEvent): Promise<void> {
    this.logger.log(
      `Handling PostScheduled event for post: ${event.aggregateId}`,
      {
        postId: event.aggregateId,
        title: event.title,
        scheduledAt: event.scheduledAt,
        minutesUntil: event.getMinutesUntilPublication(),
      },
    );

    try {
      // Schedule the publication job
      await this.schedulePublicationJob(event);

      // Notify author about scheduling
      await this.notifyAuthorAboutScheduling(event);

      this.logger.log(
        `PostScheduled event processed successfully for post: ${event.aggregateId}`,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(
        `Failed to handle PostScheduled event for post: ${event.aggregateId}`,
        error.stack,
      );
    }
  }

  private async schedulePublicationJob(
    event: PostScheduledEvent,
  ): Promise<void> {
    // TODO: Schedule job with Bull/BullMQ
    this.logger.debug(
      `Would schedule publication job for post: ${event.slug} at ${event.scheduledAt.toDateString()}`,
    );

    return new Promise(() => {});
  }

  private async notifyAuthorAboutScheduling(
    event: PostScheduledEvent,
  ): Promise<void> {
    // TODO: Send notification to author
    this.logger.debug(
      `Would notify author ${event.authorId} about post scheduling`,
    );

    return new Promise(() => {});
  }
}
