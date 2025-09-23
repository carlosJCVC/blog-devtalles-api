import { z } from 'zod';

export const InitiateOAuthSchema = z.object({
  redirectUri: z.url('Invalid redirect URI'),
});

export const CompleteOAuthSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().min(1, 'State parameter is required'),
  redirectUri: z.url('Invalid redirect URI'),
});

export const DiscordUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email().optional(),
  avatar: z.string().nullable().optional(),
  discriminator: z.string().optional(),
  global_name: z.string().nullable().optional(),
});

// Type exports
export type InitiateOAuthPayload = z.infer<typeof InitiateOAuthSchema>;
export type CompleteOAuthPayload = z.infer<typeof CompleteOAuthSchema>;
export type DiscordUserPayload = z.infer<typeof DiscordUserSchema>;
