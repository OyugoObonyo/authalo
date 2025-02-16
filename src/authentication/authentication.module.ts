import { RefreshTokenEntity } from '@authentication/impl/entities/postgresql/refresh-token.entity';
import { SessionEntity } from '@authentication/impl/entities/postgresql/session.entity';
import { SessionRepository } from '@authentication/impl/repositories/postgresql/session.repository';
import {
  SESSION_REPOSITORY_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
} from '@authentication/impl/repositories/repository.tokens';
import { provideRepository } from '@common/providers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptHashingService } from '@authentication/impl/hashing/bcrypt.hashing.service';
import { HASHING_SERVICE_TOKEN } from '@authentication/authentication.constants';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '@configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@authentication/services/authentication.service';
import { QUEUE_MANAGER_TOKEN } from '@queue/queue.constants';
import { PgBossQueueManager } from '@queue/impl/managers/pgboss.manager';
import { RegistryModule } from '@registry/registry.module';
import { TokenService } from '@authentication/services/token.service';
import { RefreshTokenRepository } from '@authentication/impl/repositories/postgresql/refresh-token.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, RefreshTokenEntity]),
    UserModule,
    // TODO: investigate asProvider?
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    RegistryModule,
  ],
  providers: [
    ...provideRepository(
      SessionEntity,
      SESSION_REPOSITORY_TOKEN,
      SessionRepository,
    ),
    ...provideRepository(
      RefreshTokenEntity,
      REFRESH_TOKEN_REPOSITORY_TOKEN,
      RefreshTokenRepository,
    ),
    {
      provide: HASHING_SERVICE_TOKEN,
      useClass: BcryptHashingService,
    },
    {
      provide: QUEUE_MANAGER_TOKEN,
      useClass: PgBossQueueManager,
    },
    AuthService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthenticationModule {}
