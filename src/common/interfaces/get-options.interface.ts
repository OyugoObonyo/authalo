import { FindOptionsSelect } from 'typeorm';

export interface GetOptions<T> extends GetOneOptions<T> {
  limit?: number;
}

export interface GetOneOptions<T> {
  fields?: FindOptionsSelect<T>;
}
