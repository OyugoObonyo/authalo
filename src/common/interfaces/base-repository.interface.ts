import { GetOneOptions } from '@common/interfaces/get-options.interface';

// TODO: Remake GetOptions and GetOneOptions; current implementation is off
// TODO: Instead of defining getById solo, maybe consider getByQ() for wider implementations
export interface BaseRepository<T> {
  create(params: Partial<T>): Promise<T>;
  get?(): Promise<T[]>;
  getById?(id: string): Promise<T>;
  getOne?(options: GetOneOptions<T>): Promise<T>;
  update?(entityId: string | number, params: Partial<T>): Promise<Partial<T>>;
  softDelete?(entity: T): Promise<T>;
  delete?(entity: T): Promise<void>;
}
