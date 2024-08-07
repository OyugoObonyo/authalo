import { SESSION_REPOSITORY_TOKEN } from '@auth/repositories/repository.tokens';
import { Session } from '@auth/interfaces/session.interface';
import { BaseRepository } from '@common/interfaces/base-repository.interface';
import { Inject } from '@nestjs/common';

// Check dist folder to see how the session repository token is represented
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepo: BaseRepository<Session>,
  ) {}

  async getById(id: string): Promise<Session> {
    return await this.sessionRepo.getById(id);
  }
}
