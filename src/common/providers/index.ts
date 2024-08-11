import {
  Injectable,
  InternalServerErrorException,
  Provider,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@src/common/interfaces/base-repository.interface';
import { Repository } from 'typeorm';

@Injectable()
class ProvideRepositoryDependencies<T> {
  constructor(public typeOrmRepository: Repository<T>) {}
}

function createRepositoryDependenciesProvider<T>(
  entity: new () => T,
): new (repository: Repository<T>) => ProvideRepositoryDependencies<T> {
  @Injectable()
  class DynamicRepositoryDependenciesProvider extends ProvideRepositoryDependencies<T> {
    constructor(@InjectRepository(entity) repository: Repository<T>) {
      super(repository);
    }
  }

  return DynamicRepositoryDependenciesProvider;
}

// TODO: Prefer a different type definition from any
export function provideRepository(
  entity: any,
  token: string,
  cls: any,
): Provider[] {
  const dependencyProvider = createRepositoryDependenciesProvider(entity);
  return [
    {
      provide: token,
      inject: [dependencyProvider],
      useFactory: async (
        dependenciesProvider,
      ): Promise<BaseRepository<typeof entity>> => {
        await ConfigModule.envVariablesLoaded;
        const dbSystem = process.env.DB_SYSTEM;
        switch (dbSystem) {
          case 'postgresql':
            return new cls(dependenciesProvider.typeOrmRepository);
          default:
            throw new InternalServerErrorException(
              `${dbSystem} is not a supported database system`,
            );
        }
      },
    },
    dependencyProvider,
  ];
}
