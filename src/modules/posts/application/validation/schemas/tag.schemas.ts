import z from 'zod';

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name cannot be empty')
    .max(50, 'Tag name cannot exceed 50 characters')
    .trim()
    .toLowerCase(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const tagSearchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(50, 'Search query cannot exceed 50 characters')
    .trim(),

  limit: z.number().int().min(1).max(50).optional().default(10),
});

export type TagSearchInput = z.infer<typeof tagSearchSchema>;
