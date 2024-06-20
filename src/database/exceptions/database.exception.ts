import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class DatabaseException extends HttpException {
  constructor(
    message: string,
    options: HttpExceptionOptions,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status, options);
  }
}
