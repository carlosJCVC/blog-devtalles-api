import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { UserNotFoundException } from '@src/modules/users/domain/exceptions/user-not-found.exception';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
