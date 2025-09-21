import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostUnlikedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly slug: string,
    public readonly userId: string,
    public readonly previousLikesCount: number,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.unliked';
  }

  getNewLikesCount(): number {
    return Math.max(0, this.previousLikesCount - 1);
  }
}
