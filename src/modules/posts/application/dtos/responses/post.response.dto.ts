import { AuthorResponseDto } from './author.response.dto';
import { CategoryResponseDto } from './category.response.dto';
import { TagResponseDto } from './tag.response.dto';

export class PostResponseDto {
  id: number;

  title: string;

  slug: string;

  content: string;

  featuredImageUrl?: string;

  status: string;

  publishedAt?: Date | string;

  scheduledAt?: Date | string;

  author?: AuthorResponseDto;

  categories?: CategoryResponseDto[];

  tags?: TagResponseDto[];

  viewsCount: number;

  likesCount: number;

  commentsCount: number;

  allowComments: boolean;

  readingTimeMinutes: number;

  createdAt: Date | string;

  updatedAt: Date | string;
}
