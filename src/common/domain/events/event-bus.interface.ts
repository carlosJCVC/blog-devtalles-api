import { DomainEvent } from './domain-event.base';

export const EVENT_BUS_TOKEN = 'EventBus';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
