import { Query } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export const ZodQuery = <T>(schema: ZodType<T>) => {
  return Query(new ZodValidationPipe<T>(schema));
};
