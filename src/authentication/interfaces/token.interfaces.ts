import { ObjectLiteral } from '@src/common/interfaces/object-literal';
import { User } from '@user/interfaces/user.interface';

export interface RefreshToken {
  id: string;
  isRevoked: boolean;
  expiresAt: Date;
  user: Partial<User>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TokenPayload extends ObjectLiteral {
  sub: string;
  jti?: string;
}
