import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';
import { RegisterPayload } from '../../schemas/register.schema';
import { UserAlreadyExistsException } from '@src/modules/users/domain/exceptions/user-already-exists.exception';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import { UserMapper } from '@src/modules/users/application/mappers/user.mapper';

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,

    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: RegisterPayload): Promise<UserEntity> {
    this.logger.log(`Register user with data: "${JSON.stringify(dto)}"`);

    // Check if user already exists
    const existsByEmail = await this.usersRepository.existsByEmail(dto.email);
    if (existsByEmail) {
      throw new UserAlreadyExistsException('email', dto.email);
    }

    const existsByUsername = await this.usersRepository.existsByUsername(
      dto.username,
    );
    if (existsByUsername) {
      throw new UserAlreadyExistsException('username', dto.username);
    }

    const entity = await UserMapper.fromRegisterDtoToEntity(dto);

    // Save user
    const user = await this.usersRepository.save(entity);

    await this.publishDomainEvents(user);

    this.logger.log(
      `User registered successfully: "${JSON.stringify(entity)}"`,
    );

    return user;
  }

  private async publishDomainEvents(user: UserEntity): Promise<void> {
    const events = user.domainEvents;

    for (const event of events) {
      await this.eventBus.publish(event);
    }

    user.clearDomainEvents();
  }
}
