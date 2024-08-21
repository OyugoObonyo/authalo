import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@src/common/interfaces/base-repository.interface';
import { USER_REPOSITORY_TOKEN } from '@users/user.constants';
import { User } from '@users/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: BaseRepository<User>,
  ) {}

  async create(params: Partial<User>): Promise<User> {
    return await this.userRepo.create(params);
  }

  async get(): Promise<User[]> {
    return await this.userRepo.get();
  }
}
