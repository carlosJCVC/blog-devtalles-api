import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly title: string,
    public readonly slug: string,
    public readonly authorId: number,
    public readonly categoryIds: number[] = [],
    public readonly tagIds: number[] = [],
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.created';
  }
}
