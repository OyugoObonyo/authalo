import { MigrationInterface, QueryRunner } from 'typeorm';

export class InstallUlidExtension1723514541299 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_uuidv7"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "pg_uuidv7"`);
  }
}
