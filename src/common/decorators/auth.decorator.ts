import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@src/modules/users/domain/enums/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
}
