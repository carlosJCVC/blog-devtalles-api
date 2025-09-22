import { CategoryEntity } from '../entities/category.entity';

export const CATEGORY_REPOSITORY_TOKEN = 'CategoriesRepositoryInterface';

export interface CategoriesRepositoryInterface {
  create(category: CategoryEntity): Promise<CategoryEntity>;

  findById(id: number): Promise<CategoryEntity | null>;

  delete(id: number): Promise<void>;

  findAll(): Promise<CategoryEntity[]>;

  findActive(): Promise<CategoryEntity[]>;

  exists(id: number): Promise<boolean>;

  count(): Promise<number>;
}
