import { Prisma } from '@prisma/client';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';

export class CategoryMapper {
  /**
   * Maps an PostEntity to PostDto model.
   * @param entity - The Entity.
   * @returns A PostDto object representing an Post.
   */
  static fromEntity(category: CategoryEntity): CategoryDto {
    return {
      id: category.id ?? 0,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  static fromPrisma(
    prismaCategory: Prisma.CategoryUncheckedCreateInput & { id: number },
  ): CategoryEntity {
    const category = CategoryEntity.reconstitute({
      id: prismaCategory.id,
      name: prismaCategory.name,
      slug: prismaCategory.slug,
      description: prismaCategory.description ?? '',
      color: prismaCategory.color ?? '',
      isActive: prismaCategory.isActive ?? true,
      createdAt: parseDate(prismaCategory.createdAt) ?? new Date(),
      updatedAt: parseDate(prismaCategory.updatedAt) ?? new Date(),
    });

    return category;
  }

  static toCreateInput(
    category: CategoryEntity,
  ): Prisma.CategoryUncheckedCreateInput {
    return {
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      isActive: category.isActive ?? true,
    };
  }

  static toUpdateInput(
    entity: CategoryEntity,
  ): Prisma.CategoryUncheckedUpdateInput {
    const data: Prisma.CategoryUncheckedUpdateInput = {
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      color: entity.color,
      isActive: entity.isActive ?? true,
    };

    return data;
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
