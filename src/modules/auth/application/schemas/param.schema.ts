import z from 'zod';

export const discordId = z
  .string()
  .min(1, 'Discord ID is required')
  .max(100, 'Discord ID must not exceed 100 characters')
  .trim();

export const DiscordIdParamSchema = z.object({
  discordId: z
    .string()
    .min(1, 'Discord ID is required')
    .max(100, 'Discord ID must not exceed 100 characters')
    .trim(),
});

export const UserIdParamSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, 'User ID must be a number')
    .transform(Number),
});

export type DiscordIdParam = z.infer<typeof DiscordIdParamSchema>;
export type UserIdParam = z.infer<typeof UserIdParamSchema>;
