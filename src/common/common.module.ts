import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EVENT_BUS_TOKEN } from './domain/events/event-bus.interface';
import { NestjsEventBus } from './infrastructure/events/nestjs-event-bus';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Use this instance across the entire application
      global: true,
      // Set the maximum number of listeners per event
      maxListeners: 10,
      // Use wildcards
      wildcard: false,
      // The delimiter used to segment namespaces
      delimiter: '.',
      // Disable throwing uncaught errors
      ignoreErrors: false,
    }),
  ],
  providers: [
    {
      provide: EVENT_BUS_TOKEN,
      useClass: NestjsEventBus,
    },
  ],
  exports: [EVENT_BUS_TOKEN],
})
export class CommonModule {}
