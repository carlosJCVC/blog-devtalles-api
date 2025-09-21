import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostCategoriesChangedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly slug: string,
    public readonly newCategoryIds: string[],
    public readonly previousCategoryIds: string[],
    public readonly updatedBy: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.categories.changed';
  }

  getAddedCategories(): string[] {
    return this.newCategoryIds.filter(
      (id) => !this.previousCategoryIds.includes(id),
    );
  }

  getRemovedCategories(): string[] {
    return this.previousCategoryIds.filter(
      (id) => !this.newCategoryIds.includes(id),
    );
  }

  hasChanges(): boolean {
    return (
      this.getAddedCategories().length > 0 ||
      this.getRemovedCategories().length > 0
    );
  }
}
