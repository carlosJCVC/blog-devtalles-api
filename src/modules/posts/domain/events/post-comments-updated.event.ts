import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostCommentsUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly slug: string,
    public readonly newCommentsCount: number,
    public readonly previousCommentsCount: number,
    public readonly action: 'added' | 'removed',
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.comments.updated';
  }

  getCommentsDifference(): number {
    return this.newCommentsCount - this.previousCommentsCount;
  }
}
