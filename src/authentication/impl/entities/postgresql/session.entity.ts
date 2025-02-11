// TODO: Work on database module aliasing
import { Session } from '@authentication/interfaces/session.interface';
import { UserEntity } from '@user/impl/entities/postgresql/user.entity';
import { Timestamps } from 'database/embeds/timestamps.embed';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sessions' })
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
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
