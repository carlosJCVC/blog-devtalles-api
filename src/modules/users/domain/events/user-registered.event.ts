import { DomainEvent } from '@src/common/domain/events/domain-event.base';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    aggregateId: number,
    public readonly email: string,
    public readonly username: string,
    public readonly occurredAt: Date = new Date(),
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'user.created';
  }
}
