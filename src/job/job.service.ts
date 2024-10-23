import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceRegistry } from '@src/registry/service/service.registry';
import * as PgBoss from 'pg-boss';
import { JobData } from './interfaces';
import { Queue } from './interfaces/pgboss';

// How to implement only 1 job to be active at a time? For example,
// when doing batch cron operations and only want 1 job to be active at a time
// short, singleton vs stately queues policy differences?
// setting up cron jobs and schedules with PGBoss:-
// What happens when schedules collide i.e try to push a schedule that exists?
// Can 2 different schedules have the same name?
// every day at midnight, give jobs report and populate the queue stats table
// getQueue, getQueues and getQueueSize utils 4 various stats
// retry options for jobs? boss.send vs boss.work? retry delay etc?
// dead letter property and its relevance?
// send with singleton? send with delays? send with retention?
// insert multiple jobs?
// cronMonitorIntervalSeconds?
// monitor output field of Jobs table for error storage?
// offWork and notifyWorker applications?
// expose client side opertaions to be used on classes consuming this service.
// Delete a queue how? PurgeQueue behaviour??
// Clean up -> Build class as part of interface etc && more Nest Compliant
@Injectable()
export class JobService implements OnModuleInit, OnModuleDestroy {
  private readonly dbConnectionURl: string;
  private pgBoss: PgBoss;

  // TODO: Understand partitions and their use cases in pgBoss
  constructor(
    private readonly configs: ConfigService,
    // TODO: Understanding how ModuelRef works ad what it does
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

  async enqueue(
    queue: string,
    job: JobData,
    options?: PgBoss.SendOptions,
  ): Promise<string> {
    console.log('INCOMING QUEUE NAME: ', queue);
    console.log('INCOMING PAYLOAD: ', job);
    const jobId = await this.pgBoss.send(queue, job, options);
    console.log(`This is the JobId of the just queued job:: ${jobId}`);
    return jobId;
  }

  async perform(job: PgBoss.Job<JobData>): Promise<string> {
    console.log(
      `Performing job with id ${job.id},name ${job.name} and data: `,
      job.data,
    );
    const { className, method, args } = job.data;
    console.log('Getting a resolved class from service registry...');
    const resolvedClass = this.serviceRegistry.getService(className);
    console.log('Got a resolved class from service registry...', resolvedClass);
    // TODO: ModuleRef methods like get, resolve etc... familiarization
    // TODO: Error handle method doesn't exist
    const result = await resolvedClass[method](...args);
    return `Called ${method} of class ${className} with these arguements ${args} and got these results: ${result}`;
  }

  // TODO: Monitor pgBoss lifecycle on DB side and Server side
  // TODO: Why is this not being invoked?
  async onModuleDestroy(): Promise<void> {
    console.log('STOPPING PG JOB MANAGER');
    console.log('pgBoss: ', this.pgBoss);
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
      { name: 'normal-queue-3', options: { retryLimit: 10 } },
      {
        name: 'singleton-queue-3',
        options: { retryLimit: 5, policy: 'singleton' },
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
    ];
  }

  private async persistDefinedQueues(definedQueues: Queue[]): Promise<void> {
    try {
      const persistedQueues = await this.pgBoss.getQueues();
      const persistedQueuesNames = new Set(
        persistedQueues.map((persistedQueue) => persistedQueue.name),
      );
      const unpersistedQueues = definedQueues.filter(
        (definedQueue) => !persistedQueuesNames.has(definedQueue.name),
      );
      for (const queue of unpersistedQueues) {
        const { name, options } = queue;
        await this.pgBoss.createQueue(name, options as PgBoss.Queue);
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
        await this.pgBoss.work<JobData>(
          queue.name,
          async (jobs: PgBoss.Job<JobData>[]) => {
            console.log('JOBS: ', jobs);
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
      // TODO: Sentry cpature all errors?
      // TODO: Logger capture all errors?
      console.error('Error caught in error listener: ', error);
    });
  }
}
