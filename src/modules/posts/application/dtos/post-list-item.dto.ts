import { AuthorResponseDto } from './responses/author.response.dto';
import { CategoryResponseDto } from './responses/category.response.dto';
import { TagResponseDto } from './responses/tag.response.dto';

export class PostListItemDto {
  id: string;

  title: string;

  slug: string;

  featuredImageUrl?: string;

  status: string;

  publishedAt?: string;

  author: AuthorResponseDto;

  categories: CategoryResponseDto[];

  tags: TagResponseDto[];

  viewsCount: number;

  likesCount: number;

  commentsCount: number;

  readingTimeMinutes: number;

  createdAt: string;
}
