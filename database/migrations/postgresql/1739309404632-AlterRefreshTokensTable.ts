import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokensTable1739309404632
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "refresh_tokens"
        ADD "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        ADD "user_id" UUID NOT NULL,
        ADD CONSTRAINT "fk_refresh_tokens_user_id" FOREIGN KEY ("user_id")
        REFERENCES users("id") ON DELETE CASCADE 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" DROP CONSTRAINT "fk_refresh_tokens_user_id"
      ALTER TABLE "refresh_tokens" DROP COLUMN "user_id"
      ALTER TABLE "refresh_tokens" DROP COLUMN "expires_at"
      `);
  }
}
