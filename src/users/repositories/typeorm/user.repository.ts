import { BaseRepository } from '@common/interfaces/base-repository.interface';
import {
  GetOneOptions,
  GetOptions,
} from '@common/interfaces/get-options.interface';
import { User } from '@users/schema/typeorm/user.schema.typeorm';
import {User as UserSchema} from '@users/interfaces/user.interface'
import { DatabaseException } from '@db/exceptions/database.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository implements BaseRepository<UserSchema> {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>){}

     create(params: Partial<User>): Promise<User> {
    try {
        const user = this.repository.create(params)
        await this.repository.insert(user)

    } catch (error) {
      throw new DatabaseException('Database error while creating user', {
        cause: error,
        description: error.detail,
      });
    }
  }

  get(options: GetOptions<User>): Promise<User[]> {
    try {
    } catch (error) {
      throw new DatabaseException('Database error while getting users', {
        cause: error,
        description: error.detail,
      });
    }
    throw new Error('Method not implemented.');
  }

  getOne(options: GetOneOptions<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  getOne!(options: GetOneOptions<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }
  update(entity: User, params: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }
  softDelete(entity: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete?(entity: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
