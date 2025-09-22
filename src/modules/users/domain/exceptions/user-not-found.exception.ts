import { BaseDomainException } from '@src/common/domain/exceptions/base-domain.exception';

export class UserNotFoundException extends BaseDomainException {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor(identifier?: string) {
    super(
      identifier ? `User '${identifier}' not found` : 'User not found',
      identifier ? { identifier } : undefined,
    );
  }
}
