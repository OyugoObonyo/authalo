export type ValidProvider = 'email';

export interface User {
  id: string;
  passwordHash: string;
  provider: ValidProvider;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  otherName?: string;
  metadata?: Map<string, any>;
  email?: string;
  emailConfirmedAt: Date;
  bannedUntil?: Date;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
