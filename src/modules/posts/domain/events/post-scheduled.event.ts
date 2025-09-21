import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostScheduledEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly authorId: string,
    public readonly scheduledAt: Date,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.scheduled';
  }

  getMinutesUntilPublication(): number {
    const now = new Date();
    const diffMs = this.scheduledAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  }

  shouldBePublishedNow(): boolean {
    return this.scheduledAt <= new Date();
  }
}
