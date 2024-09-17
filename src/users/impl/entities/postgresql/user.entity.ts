import { Timestamps } from 'database/embeds/timestamps.embed';
import { User } from '@users/interfaces/user.interface';
import {
  Entity,
  Column,
  PrimaryColumn,
  ObjectLiteral,
  OneToMany,
} from 'typeorm';
import { SessionEntity } from '@src/authentication/impl/entities/postgresql/session.entity';

// TODO: Make entity spec 1-to-1 with migrations definition
@Entity({ name: 'users' })
export class UserEntity implements User {
  @PrimaryColumn()
  id: string;

  @Column()
  provider: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'password_hash', nullable: true, select: false })
  passwordHash: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'other_name', nullable: true })
  otherName: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: ObjectLiteral;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'email_confirmed_at', type: 'timestamptz', nullable: true })
  emailConfirmedAt: Date;

  @Column({ name: 'banned_until', type: 'timestamptz', nullable: true })
  bannedUntil: Date;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @Column(() => Timestamps, { prefix: '' })
  timestamps: Timestamps;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
