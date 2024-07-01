import {
  GetOptions,
  GetOneOptions,
} from '@common/interfaces/get-options.interface';

export interface BaseRepository<T> {
  create(params: Partial<T>): Promise<T>;
  get?(options: GetOptions<T>): Promise<T[]>;
  getOne?(options: GetOneOptions<T>): Promise<T>;
  getOneOrFail?(options: GetOneOptions<T>): Promise<T>;
  update?(entityId: string | number, params: Partial<T>): Promise<Partial<T>>;
  softDelete?(entity: T): Promise<T>;
  delete?(entity: T): Promise<void>;
}
