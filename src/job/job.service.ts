import { OnModuleDestroy, OnModuleInit, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from './interfaces/job.interface';
import PgBoss, { SendOptions } from 'pg-boss';
import { AuthService } from '@authentication/services/authentication.service';
import { UserService } from '@user/services/user.service';
import { ModuleRef } from '@nestjs/core';
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
// expose cliebnt side opertaions to be sued on classes consuming this service.
@Injectable()
export class JobService implements OnModuleInit, OnModuleDestroy {
  private readonly dbConnectionURl: string;
  private executor: PgBoss;

  constructor(
    private readonly configs: ConfigService,
    // TODO: Understanding how ModuelRef works ad what it does
    private readonly moduleRef: ModuleRef,
  ) {
    this.dbConnectionURl = this.configs.get('db.postgresql.url');
  }
  onModuleInit(): void {
    console.log('INITIALIZING PG JOB MANAGER...');

    console.log('DB connection URL: ', this.dbConnectionURl);
    this.executor = new PgBoss(this.dbConnectionURl);

    this.executor.start();
  }

  async enqueue(
    queue: string,
    job: Job,
    options?: SendOptions,
  ): Promise<string> {
    const jobId = await this.executor.send(queue, job, options);
    console.log(`This is the JobId of the just queued job: ${jobId}`);
    return jobId;
  }

  perform(job: Job): string {
    const { className, method, args } = job;
    const resolvedClass = this.resolveClass(className);
    // TODO: ModuleRef methods like get, resolve etc...
    // TODO: Validations for function exists etc...
    const resolvedClassInstance = this.moduleRef.get(resolvedClass, {
      strict: false,
    });
    const result = resolvedClassInstance[method](...args);
    return `Performed ${job} with these results: ${result}`;
  }

  resolveClass(classname: string): new (...args: any[]) => any {
    switch (classname) {
      case 'authService':
        return AuthService;
      case 'userService':
        return UserService;
      default:
        throw new Error("A class with the given name doesn't exist");
    }
  }

  // TODO: Monitor executor lifecycle on DB side and Server side
  onModuleDestroy(): void {
    console.log('STOPPING PG JOB MANAGER');
    this.executor.stop();
  }
}
