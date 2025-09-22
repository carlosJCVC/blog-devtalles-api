import { BaseEntity } from '@src/common/domain/entities/base.entity';
import { PostSlug } from '../value-objects/post-slug.vo';

export class CategoryEntity extends BaseEntity {
  private _name: string;
  private _slug: PostSlug;
  private _description?: string;
  private _color?: string; // TODO class color HERE
  private _isActive?: boolean;

  private constructor(
    name: string,
    slug: PostSlug,
    description?: string,
    color?: string,
    isActive?: boolean,
    id?: number,
  ) {
    super(id);
    this._name = name;
    this._slug = slug || PostSlug.fromValue(name);
    this._description = description;
    this._color = color;
    this._isActive = isActive || true;
  }

  static create(
    name: string,
    customSlug: string,
    description: string,
    color?: string,
    isActive?: boolean,
  ): CategoryEntity {
    const slug = PostSlug.fromValue(customSlug);

    const category = new CategoryEntity(
      name,
      slug,
      description,
      color,
      isActive,
    );

    // Add domain event [HERE]

    return category;
  }

  static reconstitute(data: {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): CategoryEntity {
    const slug = PostSlug.fromValue(data.slug);

    const category = new CategoryEntity(
      data.name,
      slug,
      data.description,
      data.color,
      data.isActive,
      data.id,
    );

    // Restore state
    category._createdAt = data.createdAt;
    category._updatedAt = data.updatedAt;
    category._deletedAt = data.deletedAt;

    return category;
  }

  // getters
  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug.value;
  }

  get description(): string | undefined {
    return this._description;
  }

  get color(): string | undefined {
    return this._color;
  }

  get isActive(): boolean {
    return this._isActive ?? true;
  }

  isValid(): boolean {
    // fro now, nets to be implemented
    return true;
  }
}
