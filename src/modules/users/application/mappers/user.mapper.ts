import { Prisma } from '@prisma/client';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import { RoleMapper } from './role.mapper';
import { StatusMapper } from './status.mapper';
import {
  DiscordRegisterPayload,
  RegisterPayload,
} from '@src/modules/auth/application/schemas/register.schema';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';

export class UserMapper {
  /**
   * Maps an PostEntity to PostDto model.
   * @param entity - The Entity.
   * @returns A PostDto object representing an Post.
   */
  static fromEntityToDto(entity: UserEntity): UserDto {
    return {
      id: entity.id ?? 0,
      username: entity.username,
      email: entity.email,
      fullName: `${entity.firstName} ${entity.lastName}`,
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.role,
      status: entity.status,
      avatar: entity.avatar,
      bio: entity.bio,
      isEmailVerified: true,
      lastLoginAt: entity.lastLoginAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromPrismaToEntity(
    prismaUser: Prisma.UserUncheckedCreateInput & { id: number },
  ): UserEntity {
    const user = UserEntity.reconstitute({
      id: prismaUser.id ?? 0,
      username: prismaUser.username,
      email: prismaUser.email,
      firstName: prismaUser.firstName ?? '',
      lastName: prismaUser.lastName ?? '',
      role: RoleMapper.fromPrisma(prismaUser.role),
      status: StatusMapper.fromPrisma(prismaUser.status),
      avatar: prismaUser.avatar ?? '',
      bio: prismaUser.bio ?? '',
      password: prismaUser.password,
      lastLoginAt: parseDate(prismaUser.lastLoginAt) ?? new Date(),
      refreshToken: prismaUser.refreshToken!,
      refreshTokenExpiresAt: parseDate(prismaUser.refreshTokenExpiresAt),
      createdAt: parseDate(prismaUser.createdAt) ?? new Date(),
      updatedAt: parseDate(prismaUser.updatedAt) ?? new Date(),
    });

    return user;
  }

  static async fromRegisterDtoToEntity(
    payload: RegisterPayload,
  ): Promise<UserEntity> {
    const user = UserEntity.create(
      payload.username,
      payload.email,
      payload.password,
      payload.firstName,
      payload.lastName,
      UserRole.USER,
    );

    return user;
  }

  static fromDiscordRegisterDtoToEntity(
    payload: DiscordRegisterPayload,
  ): UserEntity {
    const user = UserEntity.reconstitute({
      username: payload.username,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: UserRole.AUTHOR,
      status: UserStatus.ACTIVE,
      password: '',
      discordId: payload.discordId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  }

  /**
   *
   * @param entity UserEntity
   * @returns
   */
  static toCreateInput(entity: UserEntity): Prisma.UserUncheckedCreateInput {
    return {
      username: entity.username,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.toPrismaRole,
      status: entity.toPrismaStatus,
      avatar: entity.avatar,
      bio: entity.bio,
      password: entity.passwordVO.getValue(),
      discordId: entity.discordId,
      emailVerifiedAt: entity.emailVerifiedAt,
      lastLoginAt: entity.lastLoginAt,
      refreshToken: entity.refreshToken,
      refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
    };
  }

  static toUpdateInput(entity: UserEntity): Prisma.UserUncheckedUpdateInput {
    return {
      username: entity.username,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      role: entity.toPrismaRole,
      status: entity.toPrismaStatus,
      avatar: entity.avatar,
      bio: entity.bio,
      password: entity.passwordVO.getValue(),
      discordId: entity.discordId,
      emailVerifiedAt: entity.emailVerifiedAt,
      lastLoginAt: entity.lastLoginAt,
      refreshToken: entity.refreshToken,
      refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
      updatedAt: new Date(),
    };
  }
}

const parseDate = (
  date: string | Date | undefined | null,
): Date | undefined => {
  if (date) {
    return new Date(date);
  }

  return undefined;
};
