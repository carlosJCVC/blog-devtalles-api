import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostFeaturedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly featuredBy: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.featured';
  }
}
