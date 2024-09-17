import { HashingService } from '@authentication/interfaces/hashing-service.interface';
import { Injectable } from '@nestjs/common';
import { CreateUserWithEmailAndPassword } from '@users/interfaces/dtos/create-user-dtos.interface';
import { User } from '@users/interfaces/user.interface';
import { UserService } from '@users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
  ) {}

  async signUpWithEmailAndPassword({
    password,
    ...rest
  }: CreateUserWithEmailAndPassword): Promise<User> {
    const passwordHash = await this.hashingService.hash(password);
    return this.userService.create({ ...rest, passwordHash });
  }

  loginWithEmailAndPassword(credentials: string): string {
    // introspect context for user email
    // get user email and password hash
    // check if password hash matches provided password
    // no match? throw invalid login credentials error
    // matches? create refresh_token, create session
    return credentials;
  }

  logOut(): void {}
}
