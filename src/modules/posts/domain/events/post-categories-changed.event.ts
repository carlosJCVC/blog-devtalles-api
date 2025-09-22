import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostCategoriesChangedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly slug: string,
    public readonly newCategoryIds: number[],
    public readonly previousCategoryIds: number[],
    public readonly updatedBy: number,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.categories.changed';
  }

  getAddedCategories(): number[] {
    return this.newCategoryIds.filter(
      (id) => !this.previousCategoryIds.includes(id),
    );
  }

  getRemovedCategories(): number[] {
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
