import { RefreshTokenEntity } from '@authentication/entities/refresh-token.entity';
import { SessionEntity } from '@authentication/entities/session.entity';
import { SessionRepository } from '@authentication/repositories/postgresql/session.repository';
import { SESSION_REPOSITORY_TOKEN } from '@authentication/repositories/repository.tokens';
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
