import { SessionRepository } from '@auth/repositories/postgresql/session.repository';
import { SESSION_REPOSITORY_TOKEN } from '@auth/repositories/repository.tokens';
import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseRepository } from '@src/common/interfaces/base-repository.interface';
import { Session } from '@auth/interfaces/session.interface';
@Module({
  providers: [
    {
      provide: SESSION_REPOSITORY_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService): BaseRepository<Session> => {
        const dbSystem = config.get<string>('app.dbSystem');
        switch (dbSystem) {
          case 'postgresql':
            return new SessionRepository();
          default:
            throw new InternalServerErrorException(
              `${dbSystem} is not a supported database system`,
            );
        }
      },
    },
  ],
})
export class AuthModule {}

export function Prv

