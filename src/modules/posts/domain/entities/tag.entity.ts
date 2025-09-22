import { BaseEntity } from '@src/common/domain/entities/base.entity';
import { PostSlug } from '../value-objects/post-slug.vo';

export class TagEntity extends BaseEntity {
  private _name: string;
  private _slug: PostSlug;
  private _usageCount: number;

  private constructor(
    name: string,
    slug: PostSlug,
    usageCount: number,
    id?: number,
  ) {
    super(id);
    this._name = name;
    this._slug = slug || PostSlug.fromValue(name);
    this._usageCount = usageCount || 0;
  }

  static create(
    name: string,
    customSlug: string,
    usageCount: number,
  ): TagEntity {
    const slug = PostSlug.fromValue(customSlug);

    const tag = new TagEntity(name, slug, usageCount);

    // Add domain event [HERE]

    return tag;
  }

  static reconstitute(data: {
    id: number;
    name: string;
    slug: string;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): TagEntity {
    const slug = PostSlug.fromValue(data.slug);

    const tag = new TagEntity(data.name, slug, data.usageCount, data.id);

    // Restore state
    tag._createdAt = data.createdAt;
    tag._updatedAt = data.updatedAt;
    tag._deletedAt = data.deletedAt;

    return tag;
  }

  // getters
  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug.value;
  }

  get usageCount(): number {
    return this._usageCount;
  }

  isValid(): boolean {
    // fro now, nets to be implemented
    return true;
  }
}
