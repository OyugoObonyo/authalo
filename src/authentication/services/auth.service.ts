import { HashingService } from '@authentication/interfaces/hashing-service.interface';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserWithEmailAndPassword } from '@users/interfaces/dtos/create-user-dtos.interface';
import { User } from '@users/interfaces/user.interface';
import { UserService } from '@users/services/user.service';
import { SignInUserWithEmailAndPassword } from '@authentication/interfaces/dtos/signin-user-dtos.interface';

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

  async SignInWithEmailAndPassword(
    credentials: SignInUserWithEmailAndPassword,
  ): Promise<User> {
    const { email, password } = credentials;
    const user = await this.userService.getOneBy<'email'>({ email });
    if (!user || !this.hashingService.compare(password, user.passwordHash)) {
      throw new ForbiddenException('Invalid sign-in credentials');
    }
    return user;
  }

  logOut(): void {}
}
