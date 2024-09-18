import { GetOneOptions } from '@common/interfaces/get-options.interface';

// TODO: Remake GetOptions and GetOneOptions; current implementation is off
// TODO: Instead of defining getById solo, maybe consider getByQ() for wider implementations
// TODO: Delete junk methods; methods not used/won't be used
export interface BaseRepository<T> {
  create(params: Partial<T>): Promise<T>;
  get?(): Promise<T[]>;
  // TODO: Make getBy accepts an array for multi filter where clauses?
  // TODO: Make Function signature reusable to avoid repetition?
  getBy?<K extends keyof T>(arg: { [P in K]: T[P] }): Promise<T[]>;
  getOneBy?<K extends keyof T>(arg: { [P in K]: T[P] }): Promise<T>;
  getById?(id: string): Promise<T>;
  getOne?(options: GetOneOptions<T>): Promise<T>;
  update?(entityId: string | number, params: Partial<T>): Promise<Partial<T>>;
  softDelete?(entity: T): Promise<T>;
  delete?(entity: T): Promise<void>;
}
