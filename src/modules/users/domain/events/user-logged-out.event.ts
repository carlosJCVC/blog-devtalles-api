import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class UserLoggedOutEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly email: string,
    public readonly logoutAt: Date = new Date(),
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'user.logout';
  }
}
