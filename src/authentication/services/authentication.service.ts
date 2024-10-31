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

  async testQueueing(index: number): Promise<JobData> {
    // TODO: rename job to Task maybe?
    const job = {
      className: 'userService',
      method: 'testedQueue',
      args: ['Hello Queue!!'],
    };
    console.log('Running testQueueing function with this index: ', index);
    await this.queueManager.enqueue('normal-queue-3', job);
    return job;
  }

  async testError(): Promise<JobData> {
    // TODO: rename job to Task maybe?
    const job = {
      className: 'userService',
      method: 'testErrorThrowing',
      args: [],
    };
    await this.queueManager.enqueue<SendOptions>('normal-queue-3', job, {
      deadLetter: 'failed-nomal-queue-3-jobs',
      retryBackoff: true,
    });
    return job;
  }

  async testSchedule(): Promise<void> {
    const job = {
      className: 'userService',
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
    const job = {
      className: 'userService',
      method: 'testedQueue',
      args: ['Generating some report now...'],
    };
    await this.queueManager.schedule(
      'generate-some-report',
      CronExpression.EVERY_MINUTE,
      job,
    );
  }

  logOut(): void {}
}
