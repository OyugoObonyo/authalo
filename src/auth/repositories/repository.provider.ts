import {
  Provider,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { SESSION_REPOSITORY_TOKEN } from '@auth/repositories/repository.tokens';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '@auth/entities/session.entity';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { SessionRepository } from '@auth/repositories/postgresql/session.repository';
import { BaseRepository } from '@src/common/interfaces/base-repository.interface';
import { Session } from '../interfaces/session.interface';

export function provideRepository(): Provider[] {
  return [
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: DependenciesProvider) =>
        provideRepositoryFactory(dependenciesProvider),
      inject: [DependenciesProvider],
    },
    DependenciesProvider,
  ];
}

export async function provideRepositoryFactory(
  dependenciesProvider: DependenciesProvider,
): Promise<BaseRepository<Session>> {
  await ConfigModule.envVariablesLoaded;
  const dbSystem = process.env.DB_SYSTEM;
  switch (dbSystem) {
    case 'postgresql':
      return new SessionRepository(dependenciesProvider.postgresqlTypeOrm);
    default:
      throw new InternalServerErrorException(
        `${dbSystem} is not a supported database system`,
      );
  }
}

@Injectable()
export class DependenciesProvider {
  constructor(
    @InjectRepository(SessionEntity)
    public postgresqlTypeOrm: Repository<SessionEntity>,
  ) {}
}
