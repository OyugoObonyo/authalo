import { SessionRepository } from '@auth/repositories/session.repository';
import { UserRepository } from '@users/repositories/user.repository';

export class AuthService {
  constructor(
    private readonly sessionRepo: SessionRepository,
    private readonly userRepo: UserRepository,
  ) {}

  loginWithEmailAndPassword(credentials: string): string {
    // introspect context for user email
    // get user email and password hash
    // check if password hash matches provided password
    // no match? throw invalid login credentials error
    // matches? create refresh_token, create session
    return credentials;
  }
}
