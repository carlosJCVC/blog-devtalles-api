import { BaseDomainException } from './base-domain.exception';

export class PostCannotBeEditedException extends BaseDomainException {
  readonly code = 'POST_CANNOT_BE_EDITED';
  readonly statusCode = 403;

  constructor(postId: string, currentStatus: string) {
    super(`Post cannot be edited in current status: ${currentStatus}`, {
      postId,
      currentStatus,
      editableStatuses: ['DRAFT', 'SCHEDULED'],
    });
  }
}
