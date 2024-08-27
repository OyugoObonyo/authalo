import { RefreshTokenEntity } from '@authentication/impl/entities/postgresql/refresh-token.entity';
import { SessionEntity } from '@authentication/impl/entities/postgresql/session.entity';
import { SessionRepository } from '@authentication/impl/repositories/postgresql/session.repository';
import { SESSION_REPOSITORY_TOKEN } from '@authentication/impl/repositories/repository.tokens';
import { provideRepository } from '@common/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptHashingService } from '@authentication/impl/hashing/bcrypt.hashing.service';
import { HASHING_SERVICE_TOKEN } from '@authentication/auth.constants';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, RefreshTokenEntity]),
    UsersModule,
  ],
  providers: [
    ...provideRepository(
      SessionEntity,
      SESSION_REPOSITORY_TOKEN,
      SessionRepository,
    ),
    {
      provide: HASHING_SERVICE_TOKEN,
      useClass: BcryptHashingService,
    },
  ],
})
export class AuthModule {}
