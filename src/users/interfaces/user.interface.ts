import { ObjectLiteral } from '@common/interfaces/object-literal';

export interface User {
  id: string;
  passwordHash: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}
