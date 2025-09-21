import { BaseDomainException } from './base-domain.exception';

export class PostSlugAlreadyExistsException extends BaseDomainException {
  readonly code = 'POST_SLUG_EXISTS';
  readonly statusCode = 409;

  constructor(slug: string, existingPostId?: string) {
    super(`Post with slug '${slug}' already exists`, {
      slug,
      existingPostId,
      resource: 'Post',
    });
  }
}
