import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { provideRepository } from '@common/providers';
import { UserEntity } from '@users/impl/entities/postgresql/user.entity';
import { USER_REPOSITORY_TOKEN } from '@users/user.constants';
import { UserRepository } from '@users/impl/repositories/postgresql/user.repository';
import { UsersResolver } from '@users/api/graphql/user.resolver';
import { UserService } from '@users/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    ...provideRepository(UserEntity, USER_REPOSITORY_TOKEN, UserRepository),
    UserService,
    UsersResolver,
  ],
})
export class UsersModule {}
