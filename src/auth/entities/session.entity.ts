import { Timestamps } from 'database/embeds/timestamps.embed';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '@users/entities/user.entity';
import { Session } from '@auth/interfaces/session.interface';
import { RefreshTokenEntity } from '@auth/entities/refresh-token.entity';

@Entity({ name: 'sessions', schema: 'auth' })
export class SessionEntity implements Session {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'is_blacklisted', default: false })
  isBlacklisted: boolean;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'ip_address', type: 'inet' })
  ipAddress: string;

  @Column({ name: 'refreshed_at', nullable: true })
  refreshedAt: Date;

  @Column(() => Timestamps)
  timestamps: Timestamps;

  @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.session, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn({ name: 'refresh_token_id' })
  refreshToken: RefreshTokenEntity;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
