export type SelectOptions<T> = {
  [K in keyof T]?: boolean;
};
