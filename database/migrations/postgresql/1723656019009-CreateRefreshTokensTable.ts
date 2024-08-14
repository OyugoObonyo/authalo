import { MigrationInterface, QueryRunner } from 'typeorm';
import { timestamps } from '@db/embeds/timestamps.embed';

export class CreateRefreshTokensTable1723656019009
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" uuid DEFAULT uuid_generate_v7() PRIMARY KEY,
        "is_revoked" boolean DEFAULT false,
        ${timestamps()}
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "refresh_tokens"
        `);
  }
}
