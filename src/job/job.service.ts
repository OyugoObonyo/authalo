import { OnModuleDestroy, OnModuleInit, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as PgBoss from 'pg-boss';

@Injectable()
export class JobService implements OnModuleInit, OnModuleDestroy {
  private readonly dbConnectionURl: string;
  private executor: PgBoss;

  constructor(private readonly configs: ConfigService) {
    this.dbConnectionURl = this.configs.get('db.postgresql.url');
  }
  onModuleInit(): void {
    console.log('INITIALIZING PG JOB MANAGER...');

    console.log('DB connection URL: ', this.dbConnectionURl);
    this.executor = new PgBoss(this.dbConnectionURl);
    this.executor.start();
  }

  onModuleDestroy(): void {
    console.log('STOPPING PG JOB MANAGER');
    this.executor.stop();
  }
}
