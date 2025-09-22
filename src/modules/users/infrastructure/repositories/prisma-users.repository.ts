import { Injectable, Logger } from '@nestjs/common';
import { UsersRepositoryInterface } from '../../domain/repositories/users.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { PrismaService } from '@src/database/prisma.service';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { toError } from '@src/common/errors/to-error';
import { UserMapper } from '../../application/mappers/user.mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepositoryInterface {
  private readonly logger = new Logger(PrismaUsersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new UserNotFoundException(id.toString());
      }

      return UserMapper.fromPrismaToEntity(user);
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find category by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user) {
        throw new UserNotFoundException(email);
      }

      return UserMapper.fromPrismaToEntity(user);
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find category by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByUsername(username: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        throw new UserNotFoundException(username);
      }

      return UserMapper.fromPrismaToEntity(user);
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find user by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByDiscordId(discordId: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          discordId,
        },
      });

      if (!user) {
        throw new UserNotFoundException(discordId);
      }

      return UserMapper.fromPrismaToEntity(user);
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find user by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          refreshToken,
          refreshTokenExpiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throw new UserNotFoundException(refreshToken);
      }

      return UserMapper.fromPrismaToEntity(user);
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find user by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    try {
      const data = UserMapper.toCreateInput(entity);
      this.logger.log(`Register Data: "${JSON.stringify(data)}"`);

      // Create new post
      const user = await this.prisma.user.create({
        data: {
          ...data,
        },
      });

      return UserMapper.fromPrismaToEntity(user);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Failed to save post: ${error.message}`, error.stack);
      throw error;
    }
  }

  async save(entity: UserEntity): Promise<UserEntity> {
    try {
      if (entity.id) {
        return this.update(entity);
      } else {
        return this.create(entity);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Failed to save user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    const data = UserMapper.toUpdateInput(entity);

    this.logger.log(
      `Updating user ${entity.id} with data: "${JSON.stringify(data)}"`,
    );

    const user = await this.prisma.user.update({
      where: { id: entity.id },
      data: {
        ...data,
      },
    });

    return UserMapper.fromPrismaToEntity(user);
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (err) {
      const error = toError(err);
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.prisma.user.count({
        where: {
          email,
        },
      });
      return count > 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to check if user exists: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      const count = await this.prisma.user.count({
        where: {
          username,
        },
      });
      return count > 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to check if user exists: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
