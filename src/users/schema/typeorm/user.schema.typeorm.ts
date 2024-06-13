import { User as UserInterface } from '@users/interfaces/user.interfaces';

export class User implements UserInterface {
  id: string;
  passwordHash: string;
  provider: 'email';
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
