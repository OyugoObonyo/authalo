import { HashingService } from '@authentication/interfaces/hashing-service.interface';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CronExpression } from '@common/enums/cron-expression.enum';
import { CreateUserWithEmailAndPassword } from '@user/interfaces/dtos/create-user-dtos.interface';
import { User } from '@user/interfaces/user.interface';
import { UserService } from '@user/services/user.service';
import { SignInUserWithEmailAndPassword } from '@authentication/interfaces/dtos/signin-user-dtos.interface';
import { JobData, QueueManager } from '@queue/interfaces';
import { QUEUE_MANAGER_TOKEN } from '@queue/queue.constants';
import { HASHING_SERVICE_TOKEN } from '@authentication/authentication.constants';
import { SendOptions } from 'pg-boss';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(QUEUE_MANAGER_TOKEN)
    private readonly queueManager: QueueManager,
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

  async refreshToken(): Promise<void> {}

  async testQueueing(): Promise<void> {
    // TODO: rename job to Task maybe?
    // Define buildJobParams method in targetClass
    const job: JobData<UserService, 'testedQueue'> = {
      className: 'UserService',
      method: 'testedQueue',
      args: ['Hello Queue!'],
    };
    console.log('Running testQueueing function with this job: ', job);
    await this.queueManager.enqueue('normal-queue-3', job);
  }

  async testError(): Promise<void> {
    // TODO: rename job to Task maybe?
    const job: JobData<UserService, 'testErrorThrowing'> = {
      className: 'UserService',
      method: 'testErrorThrowing',
      args: [],
    };
    // TODO: How to call enqueue function without generics and getting straight to SendOptions?
    await this.queueManager.enqueue<
      UserService,
      'testErrorThrowing',
      SendOptions
    >('normal-queue-3', job, {
      deadLetter: 'failed-nomal-queue-3-jobs',
      retryBackoff: true,
    });
  }

  async testSchedule(): Promise<void> {
    const job: JobData<UserService, 'testedQueue'> = {
      className: 'UserService',
      method: 'testedQueue',
      args: ['Hello Scheduler!!'],
    };
    //TODO: Make queue name type safe?
    // Timezone specification? Local time or UTC time?
    await this.queueManager.schedule(
      'short-queue-2',
      CronExpression.EVERY_MINUTE_OF_6_AM,
      job,
    );
  }

  async testScheduleGenerateReport(): Promise<void> {
    const job: JobData<UserService, 'testedQueue'> = {
      className: 'UserService',
      method: 'testedQueue',
      args: ['Generating some report...'],
    };
    //TODO: Make queue name type safe?
    // Timezone specification? Local time or UTC time?
    await this.queueManager.schedule(
      'short-queue-2',
      CronExpression.EVERY_MINUTE,
      job,
    );
  }

  logOut(): void {}
}
