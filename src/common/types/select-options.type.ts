import {FindOneS}
export type SelectOptions<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? SelectOptions<U>
    : T[K] extends object
      ? SelectOptions<T[K]>
      : boolean;
};

const trial: SelectOptions<User> = {
  bannedUntil: true,
};

console.log(trial);
