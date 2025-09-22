import { UserStatus as PrismaUserStatus } from '@prisma/client';
import { UserStatus } from '../../domain/enums/user-status.enum';

export class StatusMapper {
  /**
   * Maps an PostEntity to PostDto model.
   * @param entity - The Entity.
   * @returns A PostDto object representing an Post.
   */
  static fromPrisma(status: PrismaUserStatus | undefined): UserStatus {
    if (!status) {
      return UserStatus.ACTIVE;
    }

    const map: Record<PrismaUserStatus, UserStatus> = {
      [PrismaUserStatus.ACTIVE]: UserStatus.ACTIVE,
      [PrismaUserStatus.PENDING]: UserStatus.PENDING,
      [PrismaUserStatus.SUSPENDED]: UserStatus.SUSPENDED,
    };

    return map[status];
  }
}
