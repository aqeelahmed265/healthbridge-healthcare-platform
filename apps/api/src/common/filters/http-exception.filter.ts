import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '@healthbridge/contracts';
import { ErrorCode } from '@healthbridge/shared';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) || `req-${Date.now()}`;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal server error occurred.';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resPayload = exception.getResponse();

      if (typeof resPayload === 'string') {
        message = resPayload;
      } else if (typeof resPayload === 'object' && resPayload !== null) {
        const obj = resPayload as Record<string, any>;
        message = obj.message || message;
        errorCode = obj.errorCode || obj.error || ErrorCode.VALIDATION_ERROR;
        details = Array.isArray(obj.message) ? { validationErrors: obj.message } : obj.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
    }

    const errorResponse: ApiErrorResponse = {
      error: {
        code: errorCode,
        message: Array.isArray(message) ? message.join('; ') : message,
        details,
      },
      requestId,
    };

    response.status(status).json(errorResponse);
  }
}
