import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobData, QueueManager } from '@queue/interfaces';
import { Queue } from '@queue/interfaces/pgboss';
import { ServiceRegistry } from '@registry/services/service.registry';
import PgBoss from 'pg-boss';

// expose client side operations to be used on classes consuming this service.
// Clean up -> Build class as part of interface etc && more Nest Compliant
@Injectable()
export class PgBossQueueManager
  implements QueueManager, OnModuleInit, OnModuleDestroy
{
  private readonly dbConnectionURl: string;
  private pgBoss: PgBoss;

  constructor(
    private readonly configs: ConfigService,
    private readonly serviceRegistry: ServiceRegistry,
  ) {
    this.dbConnectionURl = this.configs.get('db.postgresql.url');
  }

  async onModuleInit(): Promise<void> {
    await this.initializePgBoss();
    const definedQueues = this.getDefinedQueues();
    await this.persistDefinedQueues(definedQueues);
    await this.startQueueWorkers(definedQueues);
  }

  async enqueue<T, M extends keyof T, O = PgBoss.SendOptions>(
    queue: string,
    job: JobData<T, M>,
    options?: O,
  ): Promise<void> {
    this.pgBoss.send(queue, job, options);
  }

  async schedule<T, M extends keyof T, O = PgBoss.ScheduleOptions>(
    queue: string,
    cronExpression: string,
    job: JobData<T, M>,
    options?: O,
  ): Promise<void> {
    // TODO: How do I log per job?
    await this.pgBoss.schedule(queue, cronExpression, job, options);
  }

  // TODO: Fix job function siganture?
  async perform<T, M extends keyof T>(
    job: PgBoss.Job<JobData<T, M>>,
  ): Promise<void> {
    try {
      const { className, method, args } = job.data;
      const resolvedClass = this.serviceRegistry.getService(className);
      resolvedClass[method](...args);
    } catch (error) {
      console.log('Active Job: ', job);
      const jobDetails = await this.pgBoss.getJobById(job.name, job.id, {
        includeArchive: false,
      });
      console.log('Fetched job: ', jobDetails);
      if (jobDetails.retryCount === jobDetails.retryLimit) {
        console.log(jobDetails);
      }

      throw error;
    }
  }

  // TODO: Monitor pgBoss lifecycle on DB side and Server side
  // TODO: Why is this not being invoked?
  async onModuleDestroy(): Promise<void> {
    console.log('STOPPING PG JOB MANAGER');
    await this.pgBoss.stop({ close: false });
  }

  private async initializePgBoss(): Promise<void> {
    this.pgBoss = new PgBoss({
      connectionString: this.dbConnectionURl,
    });
    this.startListeners();
    await this.pgBoss.start();
  }

  private getDefinedQueues(): Queue[] {
    return [
      {
        name: 'normal-queue-3',
        options: { retryLimit: 10, deadLetter: 'failed-nomal-queue-3-jobs' },
      },
      {
        name: 'singleton-queue-3',
        options: { retryLimit: 7, policy: 'singleton' },
      },
      { name: 'scheduler-queue-3', options: { retryLimit: 5 } },
      {
        name: 'stately-queue-3',
        options: { retryLimit: 10, policy: 'stately' },
      },
      {
        name: 'short-queue-2',
        options: { expireInMinutes: 5, policy: 'short' },
      },
      { name: 'generate-some-report', options: { retryLimit: 10 } },
      { name: 'global-scheduler', options: { retryLimit: 5 } },
      {
        name: 'failed-nomal-queue-3-jobs',
        options: { retryLimit: 2, deadLetter: 'global-scheduler' },
      },
    ];
  }

  private async persistDefinedQueues(definedQueues: Queue[]): Promise<void> {
    try {
      const persistedQueues = await this.pgBoss.getQueues();
      const persistedQueuesNames = new Set(
        persistedQueues.map((persistedQueue) => persistedQueue.name),
      );
      for (const queueDefinitions of definedQueues) {
        const { name, options } = queueDefinitions;
        if (persistedQueuesNames.has(name)) {
          await this.pgBoss.updateQueue(name, options as PgBoss.Queue);
        } else {
          await this.pgBoss.createQueue(name, options as PgBoss.Queue);
        }
      }
    } catch (error) {
      // TODO: How 2 handle failed queue creation at runtime?
      // TODO: Always escalate in Sentry in case queue wasn't created
      console.error('Error while creating defined queue...', error);
    }
  }

  private async startQueueWorkers(definedQueues: Queue[]): Promise<void> {
    try {
      for (const queue of definedQueues) {
        await this.pgBoss.work<JobData<any, any>>(
          queue.name,
          async (jobs: PgBoss.Job<JobData<any, any>>[]) => {
            for (const job of jobs) {
              await this.perform(job);
            }
          },
        );
      }
    } catch (error) {
      console.error('Error setting up queue workers: ', error);
    }
  }

  private startListeners(): void {
    this.pgBoss.on('monitor-states', (stateStats) => {
      console.log('Monitored PgBoss stats: ', stateStats);
    });

    this.pgBoss.on('stopped', () => {
      // TODO: Sentry capture stop event?
      // TODO: Logger capture stop event?
      console.log('PGBoss instance stopped: ');
    });
    this.pgBoss.on('error', (error) => {
      // TODO: Sentry capture all errors?
      // TODO: Logger capture all errors?
      console.error('Error caught in error listener: ', error);
    });
  }
}
