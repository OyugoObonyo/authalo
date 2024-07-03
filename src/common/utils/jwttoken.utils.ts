import { IncomingHttpHeaders } from 'http';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { ObjectLiteral } from '@common/interfaces/object-literal';

export function extractBearerTokenFromHeader(
  headers: IncomingHttpHeaders,
): string {
  const [type, token] = headers.authorization?.split(' ') ?? [];
  if (type === 'Bearer' && token) {
    return token;
  } else {
    throw new UnauthorizedException('A valid bearer token is required');
  }
}

// TODO: maybe make return type more rigid?
export function decodeToken(token: string, privateKey: string): ObjectLiteral {
  try {
    // TODO: maybe verify audience and issuer too?
    const decodedToken = jwt.verify(token, privateKey);
    return decodedToken;
  } catch (error) {
    throw new UnauthorizedException(error.message);
  }
}
