import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegistryModule } from '@registry/registry.module';
import { PgBossQueueManager } from './impl/managers/pgboss.manager';

@Module({
  imports: [ConfigModule, RegistryModule],
  providers: [PgBossQueueManager],
})
export class QueueModule {}
