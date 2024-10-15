import { AuthService } from '@authentication/services/authentication.service';
import { Injectable } from '@nestjs/common';
import { UserService } from '@user/services/user.service';

@Injectable()
export class ServiceRegistry {
  // TODO: How to improve type safety?
  private services: { [key: string]: any } = {};

  constructor(
    // @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    // @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.services['authService'] = this.authService;
    this.services['userService'] = this.userService;
  }

  getService(serviceName: string): any {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found in the registry.`);
    }
    return service;
  }
}
