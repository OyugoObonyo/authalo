import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UserService } from '@user/services/user.service';
import { AuthService } from '@authentication/services/authentication.service';

@Injectable()
export class ServiceRegistry implements OnModuleInit {
  // TODO: How to improve type safety?
  private services: { [key: string]: any } = {};

  constructor(private readonly moduleRef: ModuleRef) {}

  onModuleInit(): void {
    this.services['AuthService'] = this.moduleRef.get(AuthService, {
      strict: false,
    });
    this.services['UserService'] = this.moduleRef.get(UserService, {
      strict: false,
    });
  }

  getService(serviceName: string): any {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found in the registry.`);
    }
    return service;
  }
}
