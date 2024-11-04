import { CronExpression } from '@common/enums/cron-expression.enum';

// TODO: Undertsand this class definition

// TODO: Consider actor and target IDs?
// TODO: Make className more type safe?
export interface JobData<T, M extends keyof T> {
  className: string;
  method: M;
  args: T[M] extends (...args: any[]) => any ? Parameters<T[M]> : never;
  actorId?: string | number;
}

export interface QueueManager {
  enqueue<T, M extends keyof T, O = unknown>(
    queueName: string,
    job: JobData<T, M>,
    options?: O,
  ): Promise<void>;
  schedule<T, M extends keyof T, O = unknown>(
    queueName: string,
    cronExpression: CronExpression,
    job: JobData<T, M>,
    options?: O,
  ): Promise<void>;
}
