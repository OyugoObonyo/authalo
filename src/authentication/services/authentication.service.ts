import { HashingService } from '@authentication/interfaces/hashing-service.interface';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserWithEmailAndPassword } from '@user/interfaces/dtos/create-user-dtos.interface';
import { User } from '@user/interfaces/user.interface';
import { UserService } from '@user/services/user.service';
import { SignInUserWithEmailAndPassword } from '@authentication/interfaces/dtos/signin-user-dtos.interface';
import { JobService } from '@src/job/job.service';
import { JobData } from '@src/job/interfaces';
import { HASHING_SERVICE_TOKEN } from '../authentication.constants';
@Injectable()
export class AuthService {
  constructor(
    // TODO: Correct usage? Why?
    @Inject(forwardRef(() => JobService))
    private readonly jobService: JobService,
    private readonly userService: UserService,
    @Inject(HASHING_SERVICE_TOKEN)
    private readonly hashingService: HashingService,
  ) {}

  async signUpWithEmailAndPassword({
    password,
    ...rest
  }: CreateUserWithEmailAndPassword): Promise<User> {
    // TODO: Check password strength?
    const passwordHash = await this.hashingService.hash(password);
    return this.userService.create({ ...rest, passwordHash });
  }

  async SignInWithEmailAndPassword(
    credentials: SignInUserWithEmailAndPassword,
  ): Promise<User> {
    const { email, password } = credentials;
    const user = await this.userService.getOneBy<'email'>({ email });
    if (!user || !this.hashingService.compare(password, user.passwordHash)) {
      throw new ForbiddenException('Invalid sign-in credentials');
    }
    return user;
  }

  async testQueueing(index: number): Promise<JobData> {
    // TODO: rename job to Task maybe?
    const job = {
      className: 'userService',
      method: 'testedQueue',
      args: ['Hello Queue!!'],
    };
    console.log('Running testQueueing function with this index: ', index);
    await this.jobService.enqueue('normal-queue-3', job);
    return job;
  }

  async testError(): Promise<JobData> {
    // TODO: rename job to Task maybe?
    const job = {
      className: 'userService',
      method: 'testErrorThrowing',
      args: [],
    };
    await this.jobService.enqueue('normal-queue-3', job);
    return job;
  }

  logOut(): void {}
}
