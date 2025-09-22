import { BaseDomainException } from '@src/common/domain/exceptions/base-domain.exception';

export class InvalidCredentialsException extends BaseDomainException {
  readonly code = 'INVALID_CREDENTIALS';
  readonly statusCode = 401;

  constructor() {
    super('Invalid credentials provided');
  }
}
