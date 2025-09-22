import { BaseDomainException } from '@src/common/domain/exceptions/base-domain.exception';

export class UserAlreadyExistsException extends BaseDomainException {
  readonly code = 'USER_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor(field: 'email' | 'username' | 'discordId', value: string) {
    super(`User with ${field} '${value}' already exists`, { field, value });
  }
}
