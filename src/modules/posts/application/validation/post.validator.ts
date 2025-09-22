import { Inject, Injectable } from '@nestjs/common';
import type {
  CategoriesRepositoryInterface,
  PostsRepositoryInterface,
} from '../../domain/repositories';
import { POSTS_REPOSITORY_TOKEN } from '../../domain/repositories/posts.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '../../domain/repositories/categories.repository.interface';
// import { CategoriesRepositoryInterface } from '../../domain/repositories/categories.repository.interface';

@Injectable()
export class PostValidator {
  constructor(
    @Inject(POSTS_REPOSITORY_TOKEN)
    private readonly postsRepository: PostsRepositoryInterface,

    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoriesRepository: CategoriesRepositoryInterface,
  ) {}

  /**
   * Validates if slug is unique (excluding current post)
   */
  async validateSlugUniqueness(
    slug: string,
    excludePostId?: number,
  ): Promise<void> {
    const exists = await this.postsRepository.existsBySlug(slug, excludePostId);
    if (exists) {
      throw new Error(`Post with slug '${slug}' already exists`);
    }
  }

  /**
   * Validates if all category IDs exist and are active
   */
  async validateCategoryIds(categoryIds: number[]): Promise<void> {
    for (const categoryId of categoryIds) {
      const category = await this.categoriesRepository.findById(categoryId);
      if (!category) {
        throw new Error(`Category with ID '${categoryId}' not found`);
      }

      if (!category.isActive) {
        throw new Error(`Category '${category.name}' is not active`);
      }
    }
  }

  /**
   * Validates content for publication
   */
  validateForPublication(content: string, title: string): void {
    if (content.length < 100) {
      throw new Error(
        'Content must be at least 100 characters for publication',
      );
    }

    if (title.length < 5) {
      throw new Error('Title must be at least 5 characters for publication');
    }

    // Add more publication rules as needed
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 50) {
      throw new Error('Post must have at least 50 words for publication');
    }
  }

  /**
   * Validates scheduling date
   */
  validateScheduleDate(scheduledAt: Date): void {
    const now = new Date();
    const minScheduleTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

    if (scheduledAt <= minScheduleTime) {
      throw new Error(
        'Scheduled time must be at least 5 minutes in the future',
      );
    }

    const maxScheduleTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
    if (scheduledAt > maxScheduleTime) {
      throw new Error('Cannot schedule posts more than 1 year in advance');
    }
  }
}
