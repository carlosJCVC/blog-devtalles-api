import z from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name cannot be empty')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim(),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #FF0000)')
    .optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name cannot be empty')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .or(z.literal('')), // Allow empty string to clear

  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color')
    .optional()
    .or(z.literal('')), // Allow empty string to clear

  isActive: z.boolean().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
