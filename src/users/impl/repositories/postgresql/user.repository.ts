import { BaseRepository } from '@common/interfaces/base-repository.interface';
import { GetOneOptions } from '@common/interfaces/get-options.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@users/impl/entities/postgresql/user.entity';
import { User } from '@users/interfaces/user.interface';
import { DatabaseException } from 'database/exceptions/database.exception';
import { Repository } from 'typeorm';

export class UserRepository implements BaseRepository<User> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(params: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const user = this.repo.create(params);
      return await this.repo.save(user);
    } catch (error) {
      throw new DatabaseException('Database error while creating new user', {
        cause: error.message,
        description: error.detail,
      });
    }
  }

  async get(): Promise<UserEntity[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      throw new DatabaseException('Database error while getting users', {
        cause: error.message,
        description: error.detail,
      });
    }
  }

  async getOne(options?: GetOneOptions<UserEntity>): Promise<UserEntity> {
    try {
      return await this.repo.findOne({ select: options.fields });
    } catch (error) {
      throw new DatabaseException('Database error while getting user', {
        cause: error.message,
        description: error.detail,
      });
    }
  }

  async update(
    entityId: string,
    params: Partial<UserEntity>,
  ): Promise<Partial<UserEntity>> {
    try {
      await this.repo.update(entityId, params);
      return this.repo.create(params);
    } catch (error) {
      throw new DatabaseException('Database error while updating user', {
        cause: error.message,
        description: error.detail,
      });
    }
  }
}
