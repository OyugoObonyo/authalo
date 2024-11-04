import { Module } from '@nestjs/common';
import { ServiceRegistry } from '@registry/services/service.registry';

@Module({
  providers: [ServiceRegistry],
  exports: [ServiceRegistry],
})
export class RegistryModule {}
