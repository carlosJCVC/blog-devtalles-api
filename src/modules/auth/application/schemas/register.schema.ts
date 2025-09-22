import z from 'zod';

const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(50, 'Username must not exceed 50 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens',
  )
  .trim();

const emailSchema = z
  .email('Invalid email format')
  .max(100, 'Email must not exceed 100 characters')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(255, 'Password must not exceed 255 characters')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)/,
    'Password must contain at least one letter and one number',
  );

const nameSchema = z
  .string()
  .min(1, 'Name cannot be empty')
  .max(100, 'Name must not exceed 100 characters')
  .trim()
  .optional();

const discordIdSchema = z
  .string()
  .min(1, 'Discord ID is required')
  .max(100, 'Discord ID must not exceed 100 characters')
  .trim();

export const RegisterSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
});

export const DiscordRegisterSchema = z.object({
  discordId: discordIdSchema,
  username: usernameSchema,
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  avatar: z
    .url('Avatar must be a valid URL')
    .max(500, 'Avatar URL must not exceed 500 characters')
    .optional(),
});

export type RegisterPayload = z.infer<typeof RegisterSchema>;
export type DiscordRegisterPayload = z.infer<typeof DiscordRegisterSchema>;
