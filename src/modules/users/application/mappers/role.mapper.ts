import { UserRole as PrismaUserRole } from '@prisma/client';
import { UserRole } from '../../domain/enums/user-role.enum';

export class RoleMapper {
  /**
   * Maps an PostEntity to PostDto model.
   * @param entity - The Entity.
   * @returns A PostDto object representing an Post.
   */
  static fromPrisma(status: PrismaUserRole | undefined): UserRole {
    if (!status) {
      return UserRole.USER;
    }

    const map: Record<PrismaUserRole, UserRole> = {
      [PrismaUserRole.ADMIN]: UserRole.ADMIN,
      [PrismaUserRole.AUTHOR]: UserRole.AUTHOR,
      [PrismaUserRole.MODERATOR]: UserRole.MODERATOR,
      [PrismaUserRole.USER]: UserRole.USER,
    };

    return map[status];
  }
}
