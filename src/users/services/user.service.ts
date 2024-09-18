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
    return this.userRepo.create(params);
  }

  async get(): Promise<User[]> {
    return this.userRepo.get();
  }

  async getBy<K extends keyof User>(arg: { [P in K]: User[P] }): Promise<
    User[]
  > {
    return this.userRepo.getBy<K>(arg);
  }

  async getOneBy<K extends keyof User>(arg: {
    [P in K]: User[P];
  }): Promise<User | null> {
    return this.userRepo.getOneBy<K>(arg);
  }
}
