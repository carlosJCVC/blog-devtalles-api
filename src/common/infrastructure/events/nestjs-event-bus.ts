import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '@src/common/domain/events/domain-event.base';
import { EventBus } from '@src/common/domain/events/event-bus.interface';

@Injectable()
export class NestjsEventBus implements EventBus {
  private readonly logger = new Logger(NestjsEventBus.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: DomainEvent): Promise<void> {
    this.logger.debug(`Publishing event: ${event.getEventName()}`, {
      eventName: event.getEventName(),
      aggregateId: event.aggregateId,
      occurredOn: event.occurredOn,
    });

    try {
      await this.eventEmitter.emitAsync(event.getEventName(), event);

      this.logger.debug(
        `Event published successfully: ${event.getEventName()}`,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));

      this.logger.error(
        `Failed to publish event: ${event.getEventName()}`,
        error.stack,
        { eventName: event.getEventName(), aggregateId: event.aggregateId },
      );

      throw error;
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    this.logger.debug(`Publishing ${events.length} events`);

    const publishPromises = events.map((event) => this.publish(event));

    try {
      await Promise.all(publishPromises);

      this.logger.debug(`All ${events.length} events published successfully`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Failed to publish some events`, error.stack);

      throw error;
    }
  }
}
