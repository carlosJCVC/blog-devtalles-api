import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class UserLoggedInEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly email: string,
    public readonly loginAt: Date = new Date(),
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
    public readonly occurredAt: Date = new Date(),
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'user.logged';
  }
}
