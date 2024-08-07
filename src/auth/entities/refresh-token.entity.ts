import { SessionEntity } from '@auth/entities/session.entity';
import { RefreshToken } from '@auth/interfaces/refresh-token.interface';
import { Timestamps } from 'database/embeds/timestamps.embed';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_tokens', schema: 'auth' })
export class RefreshTokenEntity implements RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column(() => Timestamps)
  timestamps: Timestamps;

  @OneToOne(() => SessionEntity, (session) => session.refreshToken)
  session: SessionEntity;
}
