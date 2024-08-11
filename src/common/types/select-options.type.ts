// TODO: Deeply undertstand this type definition

export type SelectOptions<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? SelectOptions<U>
    : T[K] extends object
      ? SelectOptions<T[K]>
      : boolean;
};
