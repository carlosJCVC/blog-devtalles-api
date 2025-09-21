import z from 'zod';

export const slugSchema = z
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

export const uuidSchema = z.uuid('Invalid UUID format');

export const idNumberSchema = z.number().int().positive('Invalid id');
