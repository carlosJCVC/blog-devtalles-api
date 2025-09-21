export class PostContent {
  private readonly MIN_CONTENT_LENGTH = 50;
  private readonly MAX_CONTENT_LENGTH = 100000;

  private constructor(private readonly _content: string) {
    this.validate();
  }

  static create(content: string): PostContent {
    return new PostContent(content);
  }

  get content(): string {
    return this._content;
  }

  get wordCount(): number {
    return this._content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  get readingTimeMinutes(): number {
    const averageWordsPerMinute = 200;
    return Math.ceil(this.wordCount / averageWordsPerMinute);
  }

  private validate(): void {
    if (!this._content || this._content.trim().length === 0) {
      throw new Error('Post content cannot be empty');
    }

    const trimmedLength = this._content.trim().length;

    if (trimmedLength < this.MIN_CONTENT_LENGTH) {
      throw new Error(
        `Post content must be at least ${this.MIN_CONTENT_LENGTH} characters long`,
      );
    }

    if (trimmedLength > this.MAX_CONTENT_LENGTH) {
      throw new Error(
        `Post content cannot exceed ${this.MAX_CONTENT_LENGTH} characters`,
      );
    }
  }

  equals(other: PostContent): boolean {
    return this._content === other._content;
  }
}
