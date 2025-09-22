import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostTagsChangedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly slug: string,
    public readonly newTagIds: number[],
    public readonly previousTagIds: number[],
    public readonly updatedBy: number,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.tags.changed';
  }

  getAddedTags(): number[] {
    return this.newTagIds.filter((id) => !this.previousTagIds.includes(id));
  }

  getRemovedTags(): number[] {
    return this.previousTagIds.filter((id) => !this.newTagIds.includes(id));
  }

  hasChanges(): boolean {
    return this.getAddedTags().length > 0 || this.getRemovedTags().length > 0;
  }
}
