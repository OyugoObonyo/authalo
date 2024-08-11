import { RefreshTokenEntity } from '@auth/entities/refresh-token.entity';
import { SessionEntity } from '@auth/entities/session.entity';
import { SessionRepository } from '@auth/repositories/postgresql/session.repository';
import { SESSION_REPOSITORY_TOKEN } from '@auth/repositories/repository.tokens';
import { provideRepository } from '@common/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity, RefreshTokenEntity])],
  providers: [
    ...provideRepository(
      SessionEntity,
      SESSION_REPOSITORY_TOKEN,
      SessionRepository,
    ),
  ],
})
export class AuthModule {}
