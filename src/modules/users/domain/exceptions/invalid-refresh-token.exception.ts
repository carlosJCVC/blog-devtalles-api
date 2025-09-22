import { BaseDomainException } from '@src/common/domain/exceptions/base-domain.exception';

export class InvalidRefreshTokenException extends BaseDomainException {
  readonly code = 'INVALID_REFRESH_TOKEN';
  readonly statusCode = 401;

  constructor() {
    super('Invalid or expired refresh token');
  }
}
