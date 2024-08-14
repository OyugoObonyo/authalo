import { timestamps } from '@db/embeds/timestamps.embed';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1723625809991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v7() PRIMARY KEY,
      "provider" varchar(32) NOT NULL,
      "is_active" boolean DEFAULT true,
      "first_name" varchar(32),
      "last_name" varchar(32),
      "other_name" varchar(32),
      "metadata" jsonb,
      "email" varchar(255),
      "email_confirmed_at" timestamp with time zone,
      "password_hash" varchar(255),
      "banned_until" timestamp with time zone,
      "last_login_at" timestamp with time zone,
      ${timestamps()}
    )`);

    await queryRunner.query(
      `
      ALTER TABLE "users" ADD CONSTRAINT "check_maybe_email_not_null"
      CHECK (
        ("provider" = 'email' AND "email" IS NOT NULL) OR
        ("provider" <> 'email' AND "email" IS NULL OR "email" IS NOT NULL)
      )
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE VENTURES DROP CONSTRAINT "check_maybe_email_not_null"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
