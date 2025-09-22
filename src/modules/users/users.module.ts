import { Module } from '@nestjs/common';
import { USERS_REPOSITORY_TOKEN } from './domain/repositories/users.repository.interface';
import { PrismaUsersRepository } from './infrastructure/repositories/prisma-users.repository';
import { GetUserByIdUseCase } from './application/use-cases/queries/get-user-by-id.usecase';

@Module({
  providers: [
    // Repository Implementations
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: PrismaUsersRepository,
    },

    // Use Cases - Queries
    GetUserByIdUseCase,
  ],
  exports: [
    GetUserByIdUseCase,

    // Export repositories for potential external use
    USERS_REPOSITORY_TOKEN,
  ],
})
export class UsersModule {}
