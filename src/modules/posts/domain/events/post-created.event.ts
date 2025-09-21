import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly authorId: string,
    public readonly categoryIds: string[] = [],
    public readonly tagIds: string[] = [],
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.created';
  }
}
