import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JobService],
})
export class JobModule {}
