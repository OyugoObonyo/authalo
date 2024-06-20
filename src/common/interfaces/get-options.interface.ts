import { SelectOptions } from '@common/types/select-options.type';

export interface GetOneOptions<T> {
  filters?: Partial<T>[];
  fields?: SelectOptions<T>;
}

export interface GetOptions<T> extends GetOneOptions<T> {
  limit?: number;
}
