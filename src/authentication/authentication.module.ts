import { RefreshTokenEntity } from '@authentication/impl/entities/postgresql/refresh-token.entity';
import { SessionEntity } from '@authentication/impl/entities/postgresql/session.entity';
import { SessionRepository } from '@authentication/impl/repositories/postgresql/session.repository';
import { SESSION_REPOSITORY_TOKEN } from '@authentication/impl/repositories/repository.tokens';
import { provideRepository } from '@common/providers';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptHashingService } from '@authentication/impl/hashing/bcrypt.hashing.service';
import { HASHING_SERVICE_TOKEN } from '@authentication/authentication.constants';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '@configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from '@src/job/job.module';
import { AuthService } from './services/authentication.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, RefreshTokenEntity]),
    UserModule,
    // TODO: investigate forwardRef
    forwardRef(() => JobModule),
    // TODO: investigate asProvider?
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
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
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthenticationModule {}
