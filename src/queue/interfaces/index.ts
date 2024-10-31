import { CronExpression } from '@common/enums/cron-expression.enum';

// TODO: Consider actor and target IDs?
export interface JobData {
  className: string;
  method: string;
  args?: string[];
}

export interface QueueManager {
  enqueue<T = unknown>(
    queueName: string,
    job: JobData,
    options?: T,
  ): Promise<void>;
  schedule<T = unknown>(
    queueName: string,
    cronExpression: CronExpression,
    job: JobData,
    options?: T,
  ): Promise<void>;
}
