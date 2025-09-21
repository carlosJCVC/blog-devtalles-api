import { PostStatus } from '@src/modules/posts/domain/enums/post-status.enum';

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  include?: string[]; // Relations to include
}

export interface SearchOptions extends QueryOptions {
  searchFields?: string[]; // Fields to search in
  filters?: Record<string, any>;
}

export interface PopularityOptions {
  limit?: number;
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all';
  minViews?: number;
}

export interface PostFilters {
  status?: PostStatus;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
