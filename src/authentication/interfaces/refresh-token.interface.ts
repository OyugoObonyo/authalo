import { User } from '@user/interfaces/user.interface';

export interface RefreshToken {
  id: string;
  isRevoked: boolean;
  expiresAt: Date;
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
}
