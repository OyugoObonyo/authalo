import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SessionChecker implements NestMiddleware {
  private readonly session;
  use(req: Request, res: Response, next: NextFunction): void {}
}
