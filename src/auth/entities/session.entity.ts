import { Timestamps } from '@db/embeds/timestamps.embed';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@users/entities/user.entity';
import { Session } from '@auth/interfaces/session.interface';

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

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  @Column({ name: 'user_id' })
  user: UserEntity;
}
