import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostFeaturedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly title: string,
    public readonly slug: string,
    public readonly featuredBy: number,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.featured';
  }
}
