import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { InvalidCredentialsException } from '@src/modules/users/domain/exceptions/invalid-credentials.exception';
import { UserSuspendedException } from '@src/modules/users/domain/exceptions/user-suspended.exception';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(identifier: string, password: string): Promise<UserEntity> {
    // Find user by email or username
    const user = await this.findUserByIdentifier(identifier);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Check if user is suspended
    if (user.isSuspended()) {
      throw new UserSuspendedException(user.id?.toString());
    }

    return user;
  }

  private async findUserByIdentifier(
    identifier: string,
  ): Promise<UserEntity | null> {
    // Try to find by email first
    if (identifier.includes('@')) {
      return this.usersRepository.findByEmail(identifier);
    }
    // Otherwise try username
    return this.usersRepository.findByUsername(identifier);
  }
}
