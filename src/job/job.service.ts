import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceRegistry } from '@src/registry/service/service.registry';
import * as PgBoss from 'pg-boss';
import { Job } from './interfaces';
import { Queue } from './interfaces/pgboss';
// TODO: Archiving, Error Handling, Jobs deferral, Queue options
// error event handler, queue stats with monito states
// Whhat happens after boss is stopped but some jobs are still active?
// clearStorage utils?
// How to implement only 1 job to be active at a time? For example,
// when doing batch cron operations and only want 1 job to be active at a time
// short, singleton vs stately queues policy differences?
// setting up cron jobs and schedules with PGBoss:-
// What happens when schedules collide i.e try to push a schedule that exists?
// Can 2 different schedules have the same name?
// every day at midnight, give jobs report and populate the queue stats table
// getQueue, getQueues and getQueueSize utils 4 various stats
// retry options for jobs? boss.send vs boss.work?
// dead letter property and its relevance?
// send with singleton? send with delays? send with retention?
// insert multiple jobs?
// cronMonitorIntervalSeconds?
// monitor output field of Jobs table for error storage?
// offWork and notifyWorker applications?
// expose client side opertaions to be used on classes consuming this service.
@Injectable()
export class JobService implements OnModuleInit, OnModuleDestroy {
  private readonly dbConnectionURl: string;
  private executor: PgBoss;

  constructor(
    private readonly configs: ConfigService,
    // TODO: Understanding how ModuelRef works ad what it does
    private readonly serviceRegistry: ServiceRegistry,
  ) {
    this.dbConnectionURl = this.configs.get('db.postgresql.url');
  }

  async onModuleInit(): Promise<void> {
    console.log('INITIALIZING PG JOB MANAGER...');

    console.log('DB connection URL: ', this.dbConnectionURl);
    this.executor = new PgBoss(this.dbConnectionURl);

    await this.executor.start();
    console.log('EXECUTOR: ', this.executor);
  }

  getDefinedQueues(): Queue[] {
    return [
      { name: 'test-trial' },
      { name: 'test-trial-2', options: { retryLimit: 10 } },
      { name: 'test-trial-3', options: { retryLimit: 10, expireInMinutes: 5 } },
    ];
  }

  async maybeCreateQueues(
    definedQueues: Queue[],
    storedQueues: PgBoss.Queue[],
  ): Promise<void> {
    const storedQueuesNames = new Set(
      storedQueues.map((storedQueue) => storedQueue.name),
    );
    definedQueues.forEach(async (definedQueue) => {
      if (!storedQueuesNames.has(definedQueue.name)) {
        const { name, options } = definedQueue;
        await this.executor.createQueue(name, options);
      }
    });
  }

  async enqueue(
    queue: string,
    job: Job,
    options?: PgBoss.SendOptions,
  ): Promise<string> {
    await this.executor.createQueue(queue);
    console.log('INCOMING QUEUE NAME: ', queue);
    console.log('INCOMING PAYLOAD: ', job);
    const jobId = await this.executor.send(queue, job, options);
    console.log(`This is the JobId of the just queued job:: ${jobId}`);
    return jobId;
  }

  async perform(job: Job): Promise<string> {
    const { className, method, args } = job;
    const resolvedClass = this.serviceRegistry.getService(className);
    // TODO: ModuleRef methods like get, resolve etc... familiarization
    // TODO: Error handle method doesn't exist
    const result = await resolvedClass[method](...args);
    return `Called ${method} of class ${className} with these arguements ${args} and got these results: ${result}`;
  }

  async handlers(): Promise<void> {
    await this.executor.work('test-trial', async (job) => {
      console.log('Received this job in the test trial queue:: ', job);
    });
  }

  // TODO: Monitor executor lifecycle on DB side and Server side
  async onModuleDestroy(): Promise<void> {
    console.log('STOPPING PG JOB MANAGER');
    console.log('EXECUTOR: ', this.executor);
    this.executor.stop();
  }
}
