import z from 'zod';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(UserRole),
  status: z.enum(UserStatus),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  discordId: z.string().optional(),
  isEmailVerified: z.boolean(),
  lastLoginAt: z.union([z.date(), z.string()]).optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export type UserPayload = z.infer<typeof UserSchema>;
