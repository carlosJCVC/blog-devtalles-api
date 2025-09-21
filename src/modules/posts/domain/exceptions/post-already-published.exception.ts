import { BaseDomainException } from './base-domain.exception';

export class PostAlreadyPublishedException extends BaseDomainException {
  readonly code = 'POST_ALREADY_PUBLISHED';
  readonly statusCode = 400;

  constructor(postId: string, message: string = 'Post is already published') {
    super(message, {
      postId,
      currentStatus: 'PUBLISHED',
    });
  }
}
