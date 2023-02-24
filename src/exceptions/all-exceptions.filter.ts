import { BaseExceptionFilter } from '@nestjs/core';
import {
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(new InternalServerErrorException(exception), host);
  }
}
