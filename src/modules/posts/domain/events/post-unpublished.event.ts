import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostUnpublishedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly authorId: string,
    public readonly previousPublishedAt: Date,
    public readonly unpublishedBy?: string,
    public readonly reason?: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.unpublished';
  }
}
