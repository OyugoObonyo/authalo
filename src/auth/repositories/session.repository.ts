import { SessionEntity } from '@auth/entities/session.entity';
import { Session } from '@auth/interfaces/session.interface';
import { BaseRepository } from '@common/interfaces/base-repository.interface';
import { DatabaseException } from '@db/exceptions/database.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class SessionRepository implements BaseRepository<Session> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>,
  ) {}

  async create(params: Partial<Session>): Promise<Session> {
    try {
      const session = this.repository.create(params);
      return await this.repository.save(session);
    } catch (error) {
      throw new DatabaseException('Database error while creating new session', {
        cause: error.message,
        description: error.detail,
      });
    }
  }
}
