import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegistryModule } from '@registry/registry.module';

@Module({
  imports: [ConfigModule, RegistryModule],
})
export class QueueModule {}
