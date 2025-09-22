import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class RefreshTokenGeneratedEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly tokenId: string,
    public readonly expiresAt: Date,
    public readonly generatedAt: Date = new Date(),
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'user.token.refreshed';
  }
}
