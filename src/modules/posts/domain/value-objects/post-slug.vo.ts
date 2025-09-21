export class PostSlug {
  private constructor(private readonly _value: string) {
    this.validate();
  }

  static fromTitle(title: string): PostSlug {
    if (!title || title.trim().length === 0) {
      throw new Error('Title cannot be empty for slug generation');
    }

    const slug = title
      .toLowerCase()
      .trim()
      .normalize('NFD') // accents
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    return new PostSlug(slug);
  }

  static fromValue(slug: string): PostSlug {
    return new PostSlug(slug);
  }

  get value(): string {
    return this._value;
  }

  private validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new Error('Slug cannot be empty');
    }

    if (this._value.length > 255) {
      throw new Error('Slug cannot be longer than 255 characters');
    }

    // Slug should only contain lowercase letters, numbers, and hyphens
    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(this._value)) {
      throw new Error(
        'Slug can only contain lowercase letters, numbers, and hyphens',
      );
    }

    // Should not start or end with hyphen
    if (this._value.startsWith('-') || this._value.endsWith('-')) {
      throw new Error('Slug cannot start or end with a hyphen');
    }

    // Should not have consecutive hyphens
    if (this._value.includes('--')) {
      throw new Error('Slug cannot contain consecutive hyphens');
    }
  }

  equals(other: PostSlug): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
