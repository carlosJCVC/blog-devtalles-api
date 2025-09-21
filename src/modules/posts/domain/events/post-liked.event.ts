import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostLikedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly slug: string,
    public readonly userId: string,
    public readonly previousLikesCount: number,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.liked';
  }

  getNewLikesCount(): number {
    return this.previousLikesCount + 1;
  }
}
