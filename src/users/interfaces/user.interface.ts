import { ObjectLiteral } from '@common/interfaces/object-literal';

export interface User {
  id: string;
  provider: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  otherName: string;
  metadata: ObjectLiteral;
  email: string;
  emailConfirmedAt: Date;
  bannedUntil: Date;
  lastLoginAt: Date;
  passwordHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
