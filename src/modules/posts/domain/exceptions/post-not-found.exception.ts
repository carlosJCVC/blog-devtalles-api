import { BaseDomainException } from './base-domain.exception';

export class PostNotFoundException extends BaseDomainException {
  readonly code = 'POST_NOT_FOUND';
  readonly statusCode = 404;

  constructor(identifier: string | number) {
    super(`Post with identifier '${identifier}' was not found`, {
      identifier,
      resource: 'Post',
    });
  }

  static byId(id: string): PostNotFoundException {
    return new PostNotFoundException(id);
  }

  static bySlug(slug: string): PostNotFoundException {
    return new PostNotFoundException(slug);
  }
}
