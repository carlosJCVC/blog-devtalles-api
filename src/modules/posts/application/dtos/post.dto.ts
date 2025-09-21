import { AuthorDto } from './author.dto';
import { CategoryDto } from './category.dto';
import { TagDto } from './tag.dto';

export class PostDto {
  id: number;

  title: string;

  slug: string;

  content: string;

  featuredImageUrl?: string;

  status: string;

  publishedAt?: Date | string;

  scheduledAt?: Date | string;

  author?: AuthorDto;

  categories?: CategoryDto[];

  tags?: TagDto[];

  viewsCount: number;

  likesCount: number;

  commentsCount: number;

  allowComments: boolean;

  readingTimeMinutes: number;

  createdAt: Date | string;

  updatedAt: Date | string;
}
