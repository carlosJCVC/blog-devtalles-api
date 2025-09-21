import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostDeletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly authorId: string,
    public readonly deletedBy: string,
    public readonly isHardDelete: boolean = false,
    public readonly reason?: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.deleted';
  }

  isSoftDelete(): boolean {
    return !this.isHardDelete;
  }
}
