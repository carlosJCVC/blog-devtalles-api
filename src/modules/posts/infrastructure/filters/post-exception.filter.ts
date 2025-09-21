import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseDomainException } from '../../domain/exceptions';

@Catch(BaseDomainException)
export class PostExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PostExceptionFilter.name);

  catch(exception: BaseDomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `Domain Exception: ${exception.constructor.name}`,
      exception.stack,
      {
        code: exception.code,
        context: exception.context,
        path: request.url,
        method: request.method,
      },
    );

    const errorResponse = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        details: exception.context,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(exception.statusCode).json(errorResponse);
  }
}
