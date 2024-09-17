import { HashingService } from '@authentication/interfaces/hashing-service.interface';
import { genSalt, hash, compare } from 'bcrypt';

export class BcryptHashingService implements HashingService {
  async hash(password: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
  }

  async compare(password: string | Buffer, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
