import { Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '@user/api/graphql/models/user.model';
import { User } from '@user/interfaces/user.interface';
import { UserService } from '@user/services/user.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return await this.userService.get();
  }
}
