export class PostTitle {
  private readonly MIN_LENGTH = 3;
  private readonly MAX_LENGTH = 255;

  private constructor(private readonly _value: string) {
    this.validate();
  }

  static create(title: string): PostTitle {
    return new PostTitle(title);
  }

  get value(): string {
    return this._value;
  }

  get trimmed(): string {
    return this._value.trim();
  }

  private validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new Error('Post title cannot be empty');
    }

    const trimmedLength = this._value.trim().length;

    if (trimmedLength < this.MIN_LENGTH) {
      throw new Error(
        `Post title must be at least ${this.MIN_LENGTH} characters long`,
      );
    }

    if (trimmedLength > this.MAX_LENGTH) {
      throw new Error(`Post title cannot exceed ${this.MAX_LENGTH} characters`);
    }

    // Check for excessive whitespace
    if (this._value !== this._value.replace(/\s+/g, ' ').trim()) {
      throw new Error('Post title contains excessive whitespace');
    }
  }

  equals(other: PostTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
