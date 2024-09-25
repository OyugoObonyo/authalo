import { BaseRepository } from '@common/interfaces/base-repository.interface';
import { GetOneOptions } from '@common/interfaces/get-options.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@user/impl/entities/postgresql/user.entity';
import { DatabaseException } from 'database/exceptions/database.exception';
import { Repository } from 'typeorm';

// TODO: How can I create a single function that gets an entity by x field? i.e get by email?id?etc
export class UserRepository implements BaseRepository<UserEntity> {
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

  async getBy<K extends keyof UserEntity>(arg: {
    [P in K]: UserEntity[P];
  }): Promise<UserEntity[]> {
    try {
      return this.repo.find({ where: arg });
    } catch (error) {
      // TODO: Include the field you're fetching a user by in the error message i.e 'error while fetching user by x...'
      throw new DatabaseException(`Database error while fetching users`, {
        cause: error.message,
        description: error.detail,
      });
    }
  }

  async getOneBy<K extends keyof UserEntity>(arg: {
    [P in K]: UserEntity[P];
  }): Promise<UserEntity | null> {
    try {
      return this.repo.findOne({ where: arg });
    } catch (error) {
      // TODO: Include the field you're fetching a user by in the error message i.e 'error while fetching user by x...'
      throw new DatabaseException(`Database error while fetching user`, {
        cause: error.message,
        description: error.detail,
      });
    }
  }

  async getOne(
    options?: GetOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
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
