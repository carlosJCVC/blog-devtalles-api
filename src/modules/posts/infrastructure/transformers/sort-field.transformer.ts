export class SortFieldTransformer {
  private static readonly FIELD_MAPPING: Record<string, string> = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    publishedAt: 'publishedAt',
    scheduledAt: 'scheduledAt',
    featuredImageUrl: 'featuredImageUrl',
    viewsCount: 'viewsCount',
    likesCount: 'likesCount',
    commentsCount: 'commentsCount',
    allowComments: 'allowComments',
    authorId: 'authorId',

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
