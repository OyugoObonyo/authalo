import { AuthService } from '@authentication/services/authentication.service';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserModel } from '@users/api/graphql/models/user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // TODO: Leverage enum for provider for type safety
  @Mutation(() => UserModel, { name: 'users' })
  signUpWithEmailAndPassword(@Args('provider') provider: string): string {
    return provider;
  }
}
