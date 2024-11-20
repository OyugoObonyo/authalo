import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/interfaces/base-repository.interface';
import { USER_REPOSITORY_TOKEN } from '@user/user.constants';
import { User } from '@user/interfaces/user.interface';

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

  testedQueue(message: string): string {
    console.log(new Date());
    console.log(`IT WORKED! SEE MESSAGE: ${message}`);
    return message;
  }

  testErrorThrowing(): void {
    throw new BadRequestException(
      'Throwing unhandled error while executing a queued task',
    );
  }
}
