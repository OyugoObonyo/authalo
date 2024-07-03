import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  extractBearerTokenFromHeader,
  decodeToken,
} from '@common/utils/jwttoken.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenChecker implements NestMiddleware {
  private readonly privateKey: string;

  constructor(private readonly _config: ConfigService) {
    this.privateKey = this._config.get('jwt.privateKey');
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const token = extractBearerTokenFromHeader(req.headers);
    const decodedToken = decodeToken(token, this.privateKey);
    req['sessionId'] = decodedToken.sessionId;
    next();
  }
}
