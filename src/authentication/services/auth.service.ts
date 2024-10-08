import { SessionRepository } from '@src/authentication/impl/repositories/postgresql/session.repository';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@users/impl/repositories/postgresql/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionRepo: SessionRepository,
    private readonly userRepo: UserRepository,
  ) {}

  signUpWithEmailAndPassword(): void {}

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
