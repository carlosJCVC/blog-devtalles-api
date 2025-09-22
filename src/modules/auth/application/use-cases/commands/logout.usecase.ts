import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import { UserLoggedOutEvent } from '@src/modules/users/domain/events/user-logged-out.event';
import { UserNotFoundException } from '@src/modules/users/domain/exceptions/user-not-found.exception';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(userId: number): Promise<void> {
    // Find user
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    // Clear refresh token
    user.clearRefreshToken();

    await this.usersRepository.save(user);

    // Emit domain event
    await this.eventBus.publish(
      new UserLoggedOutEvent(user.id!, user.email, new Date()),
    );
  }
}
