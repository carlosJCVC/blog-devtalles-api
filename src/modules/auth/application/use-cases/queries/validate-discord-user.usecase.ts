import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { UserNotFoundException } from '@src/modules/users/domain/exceptions/user-not-found.exception';
import { UserSuspendedException } from '@src/modules/users/domain/exceptions/user-suspended.exception';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';

@Injectable()
export class ValidateDiscordUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(discordId: string): Promise<UserEntity> {
    // Find user by Discord ID
    const user = await this.usersRepository.findByDiscordId(discordId);
    if (!user) {
      throw new UserNotFoundException(`Discord ID: ${discordId}`);
    }

    // Check if user is suspended
    if (user.isSuspended()) {
      throw new UserSuspendedException(user.id?.toString());
    }

    return user;
  }
}
