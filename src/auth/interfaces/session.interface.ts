import { User } from '@users/interfaces/user.interface';

export interface Session {
  id: string;
  ipAddress: string;
  isBlacklisted: boolean;
  refreshedAt: Date;
  expiresAt: Date;
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
}
