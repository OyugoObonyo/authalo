import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@users/impl/entities/postgresql/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
