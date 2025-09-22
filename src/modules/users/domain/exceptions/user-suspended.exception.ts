import { BaseDomainException } from '@src/common/domain/exceptions/base-domain.exception';

export class UserSuspendedException extends BaseDomainException {
  readonly code = 'USER_SUSPENDED';
  readonly statusCode = 403;

  constructor(userId?: string) {
    super('User account is suspended', userId ? { userId } : undefined);
  }
}
