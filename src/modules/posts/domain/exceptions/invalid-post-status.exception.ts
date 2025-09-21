import { BaseDomainException } from './base-domain.exception';

export class InvalidPostStatusException extends BaseDomainException {
  readonly code = 'INVALID_POST_STATUS';
  readonly statusCode = 400;

  constructor(currentStatus: string, targetStatus: string, operation?: string) {
    const operationMsg = operation ? ` for operation: ${operation}` : '';
    super(
      `Cannot change post status from '${currentStatus}' to '${targetStatus}'${operationMsg}`,
      {
        currentStatus,
        targetStatus,
        operation,
      },
    );
  }
}
