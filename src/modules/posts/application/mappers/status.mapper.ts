import { PostStatus as PrismaPostStatus } from '@prisma/client';
import { PostStatus } from '../../domain/enums/post-status.enum';

export class StatusMapper {
  /**
   * Maps an PostEntity to PostDto model.
   * @param entity - The Entity.
   * @returns A PostDto object representing an Post.
   */
  static fromPrisma(status: PrismaPostStatus | undefined): PostStatus {
    if (!status) {
      return PostStatus.PUBLISHED;
    }

    const map: Record<PrismaPostStatus, PostStatus> = {
      [PrismaPostStatus.DRAFT]: PostStatus.DRAFT,
      [PrismaPostStatus.PUBLISHED]: PostStatus.PUBLISHED,
      [PrismaPostStatus.ARCHIVED]: PostStatus.ARCHIVED,
      [PrismaPostStatus.SCHEDULED]: PostStatus.SCHEDULED,
    };

    return map[status];
  }
}
