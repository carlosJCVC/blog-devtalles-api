import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export interface ViewerInfo {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export class PostViewedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly slug: string,
    public readonly viewerInfo: ViewerInfo,
    public readonly isUniqueView: boolean = true,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'post.viewed';
  }

  isAuthenticatedView(): boolean {
    return !!this.viewerInfo.userId;
  }

  isAnonymousView(): boolean {
    return !this.viewerInfo.userId;
  }
}
