import { RefreshToken } from '@authentication/interfaces/refresh-token.interface';
import { UserEntity } from '@user/impl/entities/postgresql/user.entity';
import { Timestamps } from 'database/embeds/timestamps.embed';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity implements RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column(() => Timestamps)
  timestamps: Timestamps;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
