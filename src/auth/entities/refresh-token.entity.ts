import { Timestamps } from '@db/embeds/timestamps.embed';
import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'refresh_tokens', schema: 'auth' })
export class RefreshTokenEntity {
  @PrimaryColumn()
  id: string;

  token;

  isRevoked;

  @Column(() => Timestamps)
  timestamps: Timestamps;

  session;

  // think
  user;
}
