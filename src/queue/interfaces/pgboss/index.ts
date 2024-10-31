import { Queue as PgBossQueueDef } from 'pg-boss';

export interface Queue {
  name: string;
  options?: Omit<PgBossQueueDef, 'name'>;
}
