import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostTagsChangedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly slug: string,
    public readonly newTagIds: string[],
    public readonly previousTagIds: string[],
    public readonly updatedBy: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.tags.changed';
  }

  getAddedTags(): string[] {
    return this.newTagIds.filter((id) => !this.previousTagIds.includes(id));
  }

  getRemovedTags(): string[] {
    return this.previousTagIds.filter((id) => !this.newTagIds.includes(id));
  }

  hasChanges(): boolean {
    return this.getAddedTags().length > 0 || this.getRemovedTags().length > 0;
  }
}
