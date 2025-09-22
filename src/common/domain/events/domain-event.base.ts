export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly aggregateId: number;
  public readonly eventVersion: number;

  constructor(aggregateId: number, eventVersion: number = 1) {
    this.aggregateId = aggregateId;
    this.eventVersion = eventVersion;
    this.occurredOn = new Date();
  }

  abstract getEventName(): string;
}
