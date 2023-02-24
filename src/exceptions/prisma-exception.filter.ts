//src/prisma-client-exception.filter.ts
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

import {
  PrismaConnectionErrors,
  PrismaErrorCode,
  PrismaValidationErrors,
} from './prisma-error-codes.filter';

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (PrismaConnectionErrors.hasOwnProperty(exception.code)) {
      const message = PrismaConnectionErrors.getMessage(exception.code);

      super.catch(new ServiceUnavailableException(message), host);
    }

    if (PrismaValidationErrors.hasOwnProperty(exception.code)) {
      const message = PrismaValidationErrors.getMessage(exception.code);

      if (exception.code === PrismaErrorCode.P2025) {
        const statusCode = HttpStatus.NOT_FOUND;

        return response.status(statusCode).json({
          message,
          statusCode,
        });
      }

      if (exception.code === PrismaErrorCode.P2002) {
        const statusCode = HttpStatus.CONFLICT;
        const fields = exception.meta.target;

        return response.status(statusCode).json({
          statusCode,
          message,
          fields,
        });
      }

      super.catch(new BadRequestException(message), host);
    }
  }
}
