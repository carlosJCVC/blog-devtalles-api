import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostUnpublishedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly title: string,
    public readonly slug: string,
    public readonly authorId: number,
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
