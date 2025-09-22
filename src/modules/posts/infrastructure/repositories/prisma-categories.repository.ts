import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CategoriesRepositoryInterface } from '../../domain/repositories';
import { PrismaService } from '@src/database/prisma.service';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryMapper } from '../../application/mappers/category.mapper';
import { toError } from '@src/common/errors/to-error';

@Injectable()
export class PrismaCategoriesRepository
  implements CategoriesRepositoryInterface
{
  private readonly logger = new Logger(PrismaCategoriesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    try {
      const data = CategoryMapper.toCreateInput(category);

      // Create new category
      const savedCategory = await this.prisma.category.create({
        data: {
          ...data,
          id: category.id,
        },
      });

      return CategoryMapper.fromPrisma(savedCategory);
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to save category: ${error.message}`,
        error.stack,
      );

      throw error;
    }
  }

  async findById(id: number): Promise<CategoryEntity> {
    try {
      const category = await this.prisma.category.findFirst({
        where: {
          id,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found!');
      }

      return CategoryMapper.fromPrisma(category);
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find category by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to delete category: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<CategoryEntity[]> {
    try {
      const categories = await this.prisma.category.findMany();

      return categories.map((i) => CategoryMapper.fromPrisma(i));
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find category by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<CategoryEntity[]> {
    try {
      const categories = await this.prisma.category.findMany({
        where: {
          isActive: true,
        },
      });

      return categories.map((i) => CategoryMapper.fromPrisma(i));
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to find category by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const count = await this.prisma.category.count({
        where: {
          id,
        },
      });

      return count > 0;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        `Failed to check if category exists: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.category.count();
    } catch (err) {
      const error = toError(err);
      this.logger.error(
        `Failed to count categorys: ${error.message}`,
        error.stack,
      );

      throw error;
    }
  }
}
