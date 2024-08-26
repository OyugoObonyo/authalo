import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

// TODO: specify common POSTGRESQL error codes and return error messages mirroring common error codes
export class DatabaseException extends HttpException {
  constructor(
    message: string,
    options: HttpExceptionOptions,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status, options);
  }
}
