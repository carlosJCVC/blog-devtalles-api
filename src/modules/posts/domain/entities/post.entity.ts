import { PostStatus as PrismaPostStatus } from '@prisma/client';
import { BaseEntity } from '@src/common/domain/entities/base.entity';
import { PostTitle } from '../value-objects/post-title.vo';
import { PostSlug } from '../value-objects/post-slug.vo';
import { PostContent } from '../value-objects/post-content.vo';
import { PostStatus, PostStatusVO } from '../enums/post-status.enum';

export class PostEntity extends BaseEntity {
  private _title: PostTitle;
  private _slug: PostSlug;
  private _content: PostContent;
  private _status: PostStatusVO;
  private _publishedAt?: Date;
  private _scheduledAt?: Date;
  private _authorId: number;
  private _featuredImageUrl?: string;
  private _viewsCount: number;
  private _likesCount: number;
  private _commentsCount: number;
  private _allowComments: boolean;

  // Collections (simplified for now)
  private _categoryIds: string[] = [];
  private _tagIds: string[] = [];

  private constructor(
    title: PostTitle,
    content: PostContent,
    authorId: number,
    slug?: PostSlug,
    id?: number,
  ) {
    super(id);
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._slug = slug || PostSlug.fromTitle(title.value);
    this._status = PostStatusVO.published();
    this._viewsCount = 0;
    this._likesCount = 0;
    this._commentsCount = 0;
    this._allowComments = true;

    this.validateAuthorId();
  }

  static create(
    title: string,
    content: string,
    authorId: number,
    customSlug?: string,
  ): PostEntity {
    const postTitle = PostTitle.create(title);
    const postContent = PostContent.create(content);
    const postSlug = customSlug ? PostSlug.fromValue(customSlug) : undefined;

    const post = new PostEntity(postTitle, postContent, authorId, postSlug);

    // Add domain event [HERE]

    return post;
  }

  static reconstitute(data: {
    id: number;
    title: string;
    content: string;
    slug: string;
    authorId: number;
    status: PostStatus;
    publishedAt?: Date;
    scheduledAt?: Date;
    featuredImageUrl?: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    allowComments: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): PostEntity {
    const postTitle = PostTitle.create(data.title);
    const postContent = PostContent.create(data.content);
    const postSlug = PostSlug.fromValue(data.slug);

    const post = new PostEntity(
      postTitle,
      postContent,
      data.authorId,
      postSlug,
      data.id,
    );

    // Restore state
    post._status = PostStatusVO.create(PostStatus.PUBLISHED);
    post._publishedAt = data.publishedAt;
    post._scheduledAt = data.scheduledAt;
    post._featuredImageUrl = data.featuredImageUrl;
    post._viewsCount = data.viewsCount;
    post._likesCount = data.likesCount;
    post._commentsCount = data.commentsCount;
    post._allowComments = data.allowComments;

    // Restore audit fields
    post._createdAt = data.createdAt;
    post._updatedAt = data.updatedAt;
    post._deletedAt = data.deletedAt;

    return post;
  }

  // getters
  get title(): string {
    return this._title.value;
  }

  get slug(): string {
    return this._slug.value;
  }

  get content(): string {
    return this._content.content;
  }

  get status(): PostStatus {
    return this._status.value;
  }

  get toPrismaStatus(): PrismaPostStatus {
    return this._status.toPrismaValue();
  }

  get publishedAt(): Date | undefined {
    return this._publishedAt;
  }

  get scheduledAt(): Date | undefined {
    return this._scheduledAt;
  }

  get authorId(): number {
    return this._authorId;
  }

  get featuredImageUrl(): string | undefined {
    return this._featuredImageUrl;
  }

  get viewsCount(): number {
    return this._viewsCount;
  }

  get likesCount(): number {
    return this._likesCount;
  }

  get commentsCount(): number {
    return this._commentsCount;
  }

  get allowComments(): boolean {
    return this._allowComments;
  }

  get categoryIds(): string[] {
    return [...this._categoryIds];
  }

  get tagIds(): string[] {
    return [...this._tagIds];
  }

  // Computed properties
  get wordCount(): number {
    return this._content.wordCount;
  }

  get readingTimeMinutes(): number {
    return this._content.readingTimeMinutes;
  }

  // bussines logic
  publish(): void {
    if (!this._status.canBePublished()) {
      throw new Error(`Cannot publish post with status: ${this._status.value}`);
    }

    this._status = PostStatusVO.published();
    this._publishedAt = new Date();
    this._scheduledAt = undefined;
    this.markAsUpdated();

    // ADD EVENT HERE
  }

  schedule(scheduledAt: Date): void {
    if (scheduledAt <= new Date()) {
      throw new Error('Scheduled date must be in the future');
    }

    if (this._status.isPublished()) {
      throw new Error('Cannot schedule an already published post');
    }

    this._status = PostStatusVO.scheduled();
    this._scheduledAt = scheduledAt;
    this._publishedAt = undefined;
    this.markAsUpdated();
  }

  unpublish(): void {
    if (!this._status.isPublished()) {
      throw new Error('Only published posts can be unpublished');
    }

    this._status = PostStatusVO.archived();
    this._publishedAt = undefined;
    this.markAsUpdated();
  }

  setFeaturedImage(imageUrl: string): void {
    this.validateUrl(imageUrl);
    this._featuredImageUrl = imageUrl;
    this.markAsUpdated();
  }

  removeFeaturedImage(): void {
    this._featuredImageUrl = undefined;
    this.markAsUpdated();
  }

  incrementViews(): void {
    this._viewsCount += 1;
    this.markAsUpdated();
  }

  incrementLikes(): void {
    this._likesCount += 1;
    this.markAsUpdated();
  }

  decrementLikes(): void {
    this._likesCount = Math.max(0, this._likesCount - 1);
    this.markAsUpdated();
  }

  updateCommentsCount(count: number): void {
    if (count < 0) {
      throw new Error('Comments count cannot be negative');
    }
    this._commentsCount = count;
    this.markAsUpdated();
  }

  toggleComments(): void {
    this._allowComments = !this._allowComments;
    this.markAsUpdated();
  }

  assignCategories(categoryIds: string[]): void {
    this.validateCategoryIds(categoryIds);
    this._categoryIds = [...categoryIds];
    this.markAsUpdated();
  }

  assignTags(tagIds: string[]): void {
    this.validateTagIds(tagIds);
    this._tagIds = [...tagIds];
    this.markAsUpdated();
  }

  canBeEdited(): boolean {
    return this._status.canBeEdited();
  }

  canBePublished(): boolean {
    return this._status.canBePublished();
  }

  isPublishedAndVisible(): boolean {
    return (
      (this._status.isPublished() &&
        this._publishedAt &&
        this._publishedAt <= new Date()) ||
      false
    );
  }

  isDraft(): boolean {
    return this._status.isDraft();
  }

  isScheduled(): boolean {
    return this._status.isScheduled();
  }

  shouldBePublishedNow(): boolean {
    return (
      (this._status.isScheduled() &&
        this._scheduledAt &&
        this._scheduledAt <= new Date()) ||
      true
    );
  }

  //   validation
  isValid(): boolean {
    try {
      this.validateAuthorId();
      return true;
    } catch {
      return false;
    }
  }

  private validateAuthorId(): void {
    if (!this._authorId) {
      throw new Error('Author ID is required');
    }

    // Todo
    // NEW VALIDATIONS HERE
  }

  private validateCategoryIds(categoryIds: string[]): void {
    if (categoryIds.length > 5) {
      throw new Error('Post cannot have more than 5 categories');
    }

    for (const id of categoryIds) {
      if (!id || id.trim().length === 0) {
        throw new Error('Category ID cannot be empty');
      }
    }
  }

  private validateTagIds(tagIds: string[]): void {
    if (tagIds.length > 10) {
      throw new Error('Post cannot have more than 10 tags');
    }

    for (const id of tagIds) {
      if (!id || id.trim().length === 0) {
        throw new Error('Tag ID cannot be empty');
      }
    }
  }

  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }
  }
}
