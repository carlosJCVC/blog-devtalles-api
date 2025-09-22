import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';
import { DiscordRegisterPayload } from '../../schemas/register.schema';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { UserAlreadyExistsException } from '@src/modules/users/domain/exceptions/user-already-exists.exception';
import { UserMapper } from '@src/modules/users/application/mappers/user.mapper';

@Injectable()
export class DiscordRegisterUseCase {
  private readonly logger = new Logger(DiscordRegisterUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,

    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: DiscordRegisterPayload): Promise<UserEntity> {
    // Check if Discord ID is already linked
    const existingDiscordUser = await this.usersRepository.findByDiscordId(
      dto.discordId,
    );
    if (existingDiscordUser) {
      throw new UserAlreadyExistsException('discordId', dto.discordId);
    }

    // Check if email already exists
    const existsByEmail = await this.usersRepository.existsByEmail(dto.email);
    if (existsByEmail) {
      throw new UserAlreadyExistsException('email', dto.email);
    }

    // Check if username already exists
    const existsByUsername = await this.usersRepository.existsByUsername(
      dto.username,
    );
    if (existsByUsername) {
      throw new UserAlreadyExistsException('username', dto.username);
    }

    // Create user entity with Discord data
    const user = UserMapper.fromDiscordRegisterDtoToEntity(dto);

    // Auto-verify email for Discord users
    user.verifyEmail();

    // Save user
    const savedUser = await this.usersRepository.save(user);

    return savedUser;
  }
}
