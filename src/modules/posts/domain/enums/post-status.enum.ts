import { PostStatus as PrismaPostStatus } from '@prisma/client';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  SCHEDULED = 'SCHEDULED',
}

export class PostStatusVO {
  private constructor(private readonly _value: PostStatus) {}

  static create(status: PostStatus): PostStatusVO {
    return new PostStatusVO(status);
  }

  static draft(): PostStatusVO {
    return new PostStatusVO(PostStatus.DRAFT);
  }

  static published(): PostStatusVO {
    return new PostStatusVO(PostStatus.PUBLISHED);
  }

  static archived(): PostStatusVO {
    return new PostStatusVO(PostStatus.ARCHIVED);
  }

  static scheduled(): PostStatusVO {
    return new PostStatusVO(PostStatus.SCHEDULED);
  }

  get value(): PostStatus {
    return this._value;
  }

  isDraft(): boolean {
    return this._value === PostStatus.DRAFT;
  }

  isPublished(): boolean {
    return this._value === PostStatus.PUBLISHED;
  }

  isArchived(): boolean {
    return this._value === PostStatus.ARCHIVED;
  }

  isScheduled(): boolean {
    return this._value === PostStatus.SCHEDULED;
  }

  canBePublished(): boolean {
    return (
      this._value === PostStatus.DRAFT || this._value === PostStatus.SCHEDULED
    );
  }

  canBeEdited(): boolean {
    return (
      this._value === PostStatus.DRAFT || this._value === PostStatus.SCHEDULED
    );
  }

  toPrismaValue(): PrismaPostStatus {
    const map: Record<string, PostStatus> = {
      draft: PostStatus.DRAFT,
      published: PostStatus.PUBLISHED,
      archived: PostStatus.ARCHIVED,
      scheduled: PostStatus.SCHEDULED,
    };

    return map[this._value.toLowerCase()];
  }

  equals(other: PostStatusVO): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
