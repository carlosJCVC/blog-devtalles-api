import { Inject, Injectable } from '@nestjs/common';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';
import { UserNotFoundException } from '@src/modules/users/domain/exceptions/user-not-found.exception';
import { UserMapper } from '@src/modules/users/application/mappers/user.mapper';
import { UserDto } from '@src/modules/users/application/dtos/user.dto';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async execute(userId: number): Promise<UserDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    return UserMapper.fromEntityToDto(user);
  }
}
