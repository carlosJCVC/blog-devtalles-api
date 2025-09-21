import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  private readonly uuidSchema = z.string().uuid('Invalid UUID format');

  transform(value: string) {
    const parsed = this.uuidSchema.safeParse(value);

    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
          code: i.code,
        })),
        statusCode: 400,
      });
    }

    return parsed.data;
  }
}

@Injectable()
export class SlugValidationPipe implements PipeTransform<string, string> {
  private readonly slugSchema = z
    .string()
    .min(1, 'Slug cannot be empty')
    .max(255, 'Slug cannot exceed 255 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    );

  transform(value: string): string {
    const parsed = this.slugSchema.safeParse(value);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join('; ');
      throw new BadRequestException(`Invalid slug: ${msg}`);
    }

    return parsed.data;
  }
}

@Injectable()
export class PaginationValidationPipe implements PipeTransform {
  private readonly paginationSchema = z
    .object({
      page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
      limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10)),
    })
    .refine((data) => data.page >= 1, 'Page must be at least 1')
    .refine(
      (data) => data.limit >= 1 && data.limit <= 100,
      'Limit must be between 1 and 100',
    );

  transform(value: any) {
    try {
      return this.paginationSchema.parse(value);
    } catch (error) {
      throw new BadRequestException(`Invalid pagination parameters ${error}`);
    }
  }
}
