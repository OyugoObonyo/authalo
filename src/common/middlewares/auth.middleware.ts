import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// What does this middleware do?:
// 1. Token validation <Is token valid and not expired?> --> Functional
// 2. Session validation <Is session not blacklisted? Is session not expired?> --> Has dependencies, class
// 3. User validation <Is extracted user not banned?>

// Where and hwo does IP Address extraction and recording fit in?
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log(`Request: ${req}, Response: ${res},`);
    next();
  }
}
