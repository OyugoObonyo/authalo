// Infer TypeORM find-options section

export interface FindManyOptions {}

export interface FindOneOptions {}

export interface BaseRepository<T> {
  findMany(options): Promise<T[]>;
  findOne(): Promise<T>;
  update(entity: T, params): Promise<T>;
  softDelete?(entity: T): Promise<T>;
  Delete?(entity: T): Promise<void>;
}
