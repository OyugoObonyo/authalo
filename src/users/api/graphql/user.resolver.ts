import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '@users/impl/models/user.model';
import { User } from '@users/interfaces/user.interface';
import { UserService } from '@users/services/user.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return await this.userService.get();
  }

  @Mutation(() => UserModel)
  async createUser()
}
