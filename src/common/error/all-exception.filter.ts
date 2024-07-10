import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { BaseResponse } from '../response/base.response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Handle any exception
    const message =
      response.message || exception instanceof Error
        ? exception.message
        : 'Internal server error.';

    const status = exception?.status || exception.getStatus() || 500;

    const exceptionResponse = new BaseResponse(
      null,
      exception?.response?.message || exception.message || message,
      status,
      new Date().toISOString(),
    );
    console.log('Exception all: ', exceptionResponse, request.url);

    response.status(status).json(exceptionResponse);
  }
}
