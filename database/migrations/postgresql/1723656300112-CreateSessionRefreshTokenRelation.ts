import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionRefreshTokenRelation1723656300112
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "refresh_token_id" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "session_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions"
       ADD CONSTRAINT "fk_sessions_refresh_token_id" FOREIGN KEY ("refresh_token_id")
       REFERENCES refresh_tokens("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions"
       ADD CONSTRAINT "fk_sessions_user_id" FOREIGN KEY ("user_id")
       REFERENCES users("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens"
       ADD CONSTRAINT "fk_refresh_tokens_session_id" FOREIGN KEY ("session_id")
       REFERENCES sessions("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "fk_refresh_tokens_session_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "fk_sessions_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP CONSTRAINT "fk_sessions_refresh_token_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "session_id"`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP COLUMN "refresh_token_id"`,
    );
  }
}
