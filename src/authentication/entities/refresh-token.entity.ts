import { SessionEntity } from '@authentication/entities/session.entity';
import { RefreshToken } from '@authentication/interfaces/refresh-token.interface';
import { Timestamps } from 'database/embeds/timestamps.embed';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity implements RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column(() => Timestamps)
  timestamps: Timestamps;

  @OneToOne(() => SessionEntity, (session) => session.refreshToken, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: SessionEntity;
}
