import z from 'zod';
import { idNumberSchema } from './param.schemas';

const uuidSchema = z.uuid('Invalid UUID format');

const slugSchema = z
  .string()
  .min(1, 'Slug cannot be empty')
  .max(255, 'Slug cannot exceed 255 characters')
  .regex(
    /^[a-z0-9-]+$/,
    'Slug can only contain lowercase letters, numbers, and hyphens',
  )
  .refine(
    (slug) => !slug.startsWith('-') && !slug.endsWith('-'),
    'Slug cannot start or end with a hyphen',
  )
  .refine(
    (slug) => !slug.includes('--'),
    'Slug cannot contain consecutive hyphens',
  );

const urlSchema = z
  .url('Invalid URL format')
  .max(500, 'URL cannot exceed 500 characters');

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title cannot exceed 255 characters')
    .trim(),

  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .max(100000, 'Content cannot exceed 100,000 characters'),

  slug: slugSchema.optional(),

  featuredImageUrl: urlSchema.optional(),

  categoryIds: z
    .array(uuidSchema)
    .max(5, 'Post cannot have more than 5 categories')
    .optional()
    .default([]),

  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag cannot be empty')
        .max(50, 'Tag cannot exceed 50 characters')
        .trim()
        .toLowerCase(),
    )
    .max(10, 'Post cannot have more than 10 tags')
    .optional()
    .default([])
    .transform((tags) => [...new Set(tags)]), // Remove duplicates

  allowComments: z.boolean().optional().default(true),
});

export type CreatePostPayload = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title cannot exceed 255 characters')
    .trim()
    .optional(),

  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .max(100000, 'Content cannot exceed 100,000 characters')
    .optional(),

  slug: slugSchema.optional(),

  featuredImageUrl: urlSchema.optional().or(z.literal('')), // Allow empty string to remove

  categoryIds: z
    .array(idNumberSchema)
    .max(5, 'Post cannot have more than 5 categories')
    .optional(),

  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag cannot be empty')
        .max(50, 'Tag cannot exceed 50 characters')
        .trim()
        .toLowerCase(),
    )
    .max(10, 'Post cannot have more than 10 tags')
    .optional()
    .transform((tags) => (tags ? [...new Set(tags)] : undefined)),

  allowComments: z.boolean().optional(),

  changeSummary: z
    .string()
    .max(500, 'Change summary cannot exceed 500 characters')
    .optional(),
});

export type UpdatePostPayload = z.infer<typeof updatePostSchema>;

export const publishPostSchema = z.object({
  scheduledAt: z.iso
    .datetime('Invalid datetime format')
    .optional()
    .refine(
      (date) => !date || new Date(date) > new Date(),
      'Scheduled date must be in the future',
    ),
});

export type PublishPostPayload = z.infer<typeof publishPostSchema>;
