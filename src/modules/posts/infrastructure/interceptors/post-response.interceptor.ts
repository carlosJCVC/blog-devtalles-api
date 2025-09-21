import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  message?: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<D = unknown> {
  data: D[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    [k: string]: unknown;
  };
}

@Injectable()
export class PostResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T | unknown[]>>
{
  private readonly logger = new Logger(PostResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T | unknown[]>> {
    if (context.getType() !== 'http') {
      return next.handle() as unknown as Observable<ApiResponse<T | unknown[]>>;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const path = request?.originalUrl ?? request?.url ?? '';
    const startTime = Date.now();

    return next.handle().pipe(
      map((payload: T) => {
        const duration = Date.now() - startTime;

        this.logger.log(
          `${request.method} ${request.url} - ${duration}ms`,
          'PostResponseInterceptor',
        );

        if (this.isPaginatedResponse(payload)) {
          return {
            success: true,
            data: payload.data,
            meta: payload.meta,
            timestamp: new Date().toISOString(),
            path: path,
          };
        }

        return {
          success: true,
          data: payload,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }

  private isPaginatedResponse(x: unknown): x is PaginatedResponse {
    if (!x || typeof x !== 'object') return false;
    const obj = x as { data?: unknown; meta?: unknown };
    return (
      Array.isArray(obj.data) &&
      typeof obj.meta === 'object' &&
      obj.meta !== null
    );
  }
}
