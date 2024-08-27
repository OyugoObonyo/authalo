import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { provideRepository } from '@common/providers';
import { UserEntity } from '@users/impl/entities/postgresql/user.entity';
import { USER_REPOSITORY_TOKEN } from '@users/user.constants';
import { UserRepository } from '@users/impl/repositories/postgresql/user.repository';
import { UsersResolver } from '@users/api/graphql/user.resolver';
import { UserService } from '@users/services/user.service';
import { StringKeyJsonScalar } from '@common/graphql/scalars/string-key-json.scalar';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserService],
  providers: [
    ...provideRepository(UserEntity, USER_REPOSITORY_TOKEN, UserRepository),
    UserService,
    UsersResolver,
    StringKeyJsonScalar,
  ],
})
export class UsersModule {}
