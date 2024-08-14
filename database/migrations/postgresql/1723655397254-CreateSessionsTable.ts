import { MigrationInterface, QueryRunner } from 'typeorm';
import { timestamps } from '@db/embeds/timestamps.embed';

export class CreateSessionsTable1723655397254 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "sessions" (
        "id" uuid DEFAULT uuid_generate_v7() PRIMARY KEY,
        "is_blacklisted" boolean DEFAULT false,
        "ip_address" inet,
        "expires_at" timestamp with time zone not null,
        "refreshed_at" timestamp with time zone,
        ${timestamps()}        
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "sessions"`);
  }
}
