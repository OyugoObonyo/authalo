import { Module, forwardRef } from '@nestjs/common';
import { JobService } from './job.service';
import { ConfigModule } from '@nestjs/config';
import { RegistryModule } from '@src/registry/registry.module';

@Module({
  imports: [ConfigModule, forwardRef(() => RegistryModule)],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
