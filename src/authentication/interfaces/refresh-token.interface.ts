import { Session } from '@authentication/interfaces/session.interface';

export interface RefreshToken {
  id: string;
  isRevoked: boolean;
  session: Session;
  createdAt?: Date;
  updatedAt?: Date;
}
