import z from 'zod';

export const LoginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required').trim(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const DiscordLoginSchema = z.object({
  discordId: z
    .string()
    .min(1, 'Discord ID is required')
    .max(100, 'Discord ID must not exceed 100 characters')
    .trim(),
});

export type LoginPayload = z.infer<typeof LoginSchema>;
export type DiscordLoginPayload = z.infer<typeof DiscordLoginSchema>;
