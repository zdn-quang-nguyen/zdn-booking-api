import { Catch, HttpException } from '@nestjs/common';
import { BaseResponse } from '../response/base.response';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.getResponse().message || exception.getResponse();

    const exceptionResponse = new BaseResponse(
      null,
      message,
      status,
      new Date().toISOString(),
    );
    console.log('Exception: ', exceptionResponse, request.url);

    response.status(status).json(exceptionResponse);
  }
}
