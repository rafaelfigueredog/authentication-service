import { Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const cause = exception.getResponse();
    const { name, message } = exception;

    // Log Exception
    Logger.error(exception);

    const responseBody = {
      name,
      statusCode,
      message,
    };

    if (cause instanceof Object && cause.hasOwnProperty('message')) {
      responseBody['erros'] = cause['message'];
    }

    return response.status(statusCode).json(responseBody);
  }
}
