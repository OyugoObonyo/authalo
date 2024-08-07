import { SessionEntity } from '@auth/entities/session.entity';
import { Session } from '@auth/interfaces/session.interface';
import { BaseRepository } from '@common/interfaces/base-repository.interface';
import { DatabaseException } from 'database/exceptions/database.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class SessionRepository implements BaseRepository<Session> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repo: Repository<SessionEntity>,
  ) {}

  async create(params: Partial<Session>): Promise<Session> {
    try {
      const session = this.repo.create(params);
      return await this.repo.save(session);
    } catch (error) {
      throw new DatabaseException('Database error while creating new session', {
        cause: error.message,
        description: error.detail,
      });
    }
  }
}
