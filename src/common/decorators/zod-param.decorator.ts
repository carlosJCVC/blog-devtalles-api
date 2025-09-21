import { Param } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export const ZodParam = <T>(property: string, schema: ZodType<T>) => {
  return Param(property, new ZodValidationPipe<T>(schema));
};
