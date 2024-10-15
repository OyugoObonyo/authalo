import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationModule } from '@src/authentication/authentication.module';
import { UserModule } from '@src/user/user.module';
import { ServiceRegistry } from './service/service.registry';

@Module({
  imports: [
    forwardRef(() => AuthenticationModule),
    forwardRef(() => UserModule),
  ],
  providers: [ServiceRegistry],
  exports: [ServiceRegistry],
})
export class RegistryModule {}
