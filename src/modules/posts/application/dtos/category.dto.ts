export class CategoryDto {
  id: number;

  name: string;

  slug: string;

  description?: string;

  color?: string;

  createdAt: Date | string;

  updatedAt: Date | string;
}
