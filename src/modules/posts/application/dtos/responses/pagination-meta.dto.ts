export interface PaginationMetaDto {
  total: number;

  page: number;

  limit: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}
