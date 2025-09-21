import { Body } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export const ZodBody = <T>(schema: ZodType<T>) => {
  return Body(new ZodValidationPipe<T>(schema));
};
