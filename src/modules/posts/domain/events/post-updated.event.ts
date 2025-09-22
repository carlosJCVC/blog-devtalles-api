import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class PostUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly title: string,
    public readonly slug: string,
    public readonly previousTitle?: string,
    public readonly previousSlug?: string,
    public readonly updatedBy?: number,
    public readonly changeSummary?: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.updated';
  }

  hasContentChanged(): boolean {
    return this.title !== this.previousTitle;
  }

  hasSlugChanged(): boolean {
    return this.slug !== this.previousSlug;
  }
}
