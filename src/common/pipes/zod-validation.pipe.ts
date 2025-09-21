import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

type FormattedIssue = {
  field: string;
  message: string;
  code: string;
};

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      const errors = this.formatZodIssues(parsed.error);

      throw new BadRequestException({
        message: 'Validation failed',
        errors,
        statusCode: 400,
      });
    }

    return parsed.data;
  }

  private formatZodIssues(error: ZodError): FormattedIssue[] {
    return error.issues.map((issue) => ({
      field: issue.path.map(String).join('.'),
      message: issue.message,
      code: issue.code,
    }));
  }
}
