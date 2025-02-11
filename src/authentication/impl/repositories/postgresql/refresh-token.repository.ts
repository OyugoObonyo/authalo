import { BaseRepository } from '@common/interfaces/base-repository.interface';
import { RefreshTokenEntity } from '@authentication/impl/entities/postgresql/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// TODO: make module aliasing on Database module regularised
import { DatabaseException } from 'database/exceptions/database.exception';

export class RefreshTokenRepository
  implements BaseRepository<RefreshTokenEntity>
{
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repo: Repository<RefreshTokenEntity>,
  ) {}

  async create(
    params: Partial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity> {
    try {
      const refreshToken = this.repo.create(params);
      return this.repo.save(refreshToken);
    } catch (error) {
      throw new DatabaseException('Failed to create new token', {
        cause: error.message,
        description: error.detail,
      });
    }
  }

  async getOneBy<K extends keyof RefreshTokenEntity>(arg: {
    [P in K]: RefreshTokenEntity[P];
  }): Promise<RefreshTokenEntity> {
    try {
      return this.repo.findOne({ where: arg });
    } catch (error) {
      throw new DatabaseException('Failed to fetch token', {
        cause: error.message,
        description: error.detail,
      });
    }
  }
}
