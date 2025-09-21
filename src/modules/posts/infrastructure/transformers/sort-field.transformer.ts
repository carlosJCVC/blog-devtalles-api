export class SortFieldTransformer {
  private static readonly FIELD_MAPPING: Record<string, string> = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    publishedAt: 'published_at',
    scheduledAt: 'scheduled_at',
    featuredImageUrl: 'featured_image_url',
    viewsCount: 'views_count',
    likesCount: 'likes_count',
    commentsCount: 'comments_count',
    allowComments: 'allow_comments',
    authorId: 'author_id',

    // Fields that don't change
    title: 'title',
    slug: 'slug',
    content: 'content',
    status: 'status',
    id: 'id',
  };

  /**
   * Transform camelCase field to snake_case for database
   */
  static transformSortField(field: string): string {
    const dbField = this.FIELD_MAPPING[field];

    if (!dbField) {
      throw new Error(
        `Invalid sort field: ${field}. Available fields: ${Object.keys(this.FIELD_MAPPING).join(', ')}`,
      );
    }

    return dbField;
  }

  /**
   * Get all valid frontend sort fields
   */
  static getValidFields(): string[] {
    return Object.keys(this.FIELD_MAPPING);
  }

  /**
   * Check if a field is valid
   */
  static isValidField(field: string): boolean {
    return field in this.FIELD_MAPPING;
  }
}
