import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/schema/typeorm/user.schema.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
