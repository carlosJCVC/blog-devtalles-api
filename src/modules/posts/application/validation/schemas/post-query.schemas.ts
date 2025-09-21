import z from 'zod';
import { PostStatus } from '@src/modules/posts/domain/enums/post-status.enum';
import { SortFieldTransformer } from '@src/modules/posts/infrastructure/transformers/sort-field.transformer';

const VALID_SORT_FIELDS = SortFieldTransformer.getValidFields();
const uuidSchema = z.uuid('Invalid UUID format');

const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),

  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),

  sortBy: z
    .enum(VALID_SORT_FIELDS as [string, ...string[]])
    .optional()
    .default('createdAt'),

  sortOrder: z.enum(['ASC', 'DESC']).optional().default('DESC'),
});

export const postQuerySchema = paginationSchema.extend({
  status: z.enum(PostStatus).optional(),
  authorId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  categorySlug: z.string().optional(),
  tagId: z.coerce.number().int().positive().optional().optional(),
  tagSlug: z.string().optional(),
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
});

export type PostQuery = z.infer<typeof postQuerySchema>;

export const searchPostsSchema = paginationSchema.extend({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query cannot exceed 100 characters')
    .trim(),

  searchFields: z
    .array(z.enum(['title', 'content', 'tags', 'categories']))
    .optional()
    .default(['title', 'content']),

  filters: z
    .object({
      status: z.enum(PostStatus).optional(),
      authorId: uuidSchema.optional(),
      categoryId: uuidSchema.optional(),
    })
    .optional(),
});

export type SearchPostQuery = z.infer<typeof searchPostsSchema>;

export const popularPostsSchema = z.object({
  limit: z.number().int().min(1).max(50).optional().default(10),

  timeframe: z
    .enum(['day', 'week', 'month', 'year', 'all'])
    .optional()
    .default('week'),

  minViews: z.number().int().min(0).optional().default(0),
});

export type PopularPostQuery = z.infer<typeof popularPostsSchema>;
