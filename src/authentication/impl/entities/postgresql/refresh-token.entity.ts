import { RefreshToken } from '@authentication/interfaces/token.interfaces';
import { UserEntity } from '@user/impl/entities/postgresql/user.entity';
import { Timestamps } from 'database/embeds/timestamps.embed';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity implements RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  // TODO: Have this or verify with the iat field at the verify token level?
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
