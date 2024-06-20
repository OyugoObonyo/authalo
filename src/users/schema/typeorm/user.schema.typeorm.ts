import { User as UserSchema } from '@users/interfaces/user.interface';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'users', schema: 'auth' })
export class User implements UserSchema {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'password_hash', type: 'bytea' })
  passwordHash: string;

  @Column()
  provider: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ name: 'other_name', nullable: true })
  otherName?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Map<string, any>;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'email_confirmed_at', type: 'timestamptz', nullable: true })
  emailConfirmedAt: Date;

  @Column({ name: 'banned_until', type: 'timestamptz' })
  bannedUntil: Date;

  @Column({ name: 'last_login_at', type: 'timestamptz' })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
