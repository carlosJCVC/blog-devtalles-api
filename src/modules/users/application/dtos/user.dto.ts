import { UserRole } from '@src/modules/users/domain/enums/user-role.enum';
import { UserStatus } from '@src/modules/users/domain/enums/user-status.enum';

export class UserDto {
  id: number;

  username: string;

  email: string;

  fullName: string;

  firstName?: string;

  lastName?: string;

  role: UserRole;

  status: UserStatus;

  avatar?: string;

  bio?: string;

  isEmailVerified: boolean;

  lastLoginAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
