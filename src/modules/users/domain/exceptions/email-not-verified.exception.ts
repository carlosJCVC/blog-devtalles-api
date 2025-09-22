import { BaseDomainException } from '@src/common/domain/exceptions/base-domain.exception';

export class EmailNotVerifiedException extends BaseDomainException {
  readonly code = 'EMAIL_NOT_VERIFIED';
  readonly statusCode = 403;

  constructor(email?: string) {
    super(
      'Email address must be verified before login',
      email ? { email } : undefined,
    );
  }
}
