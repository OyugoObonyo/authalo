import { Session } from '@auth/interfaces/session.interface';

export interface RefreshToken {
  id: string;
  isRevoked: boolean;
  session: Session;
  createdAt?: Date;
  updatedAt?: Date;
}
