export interface CreateUserWithEmailAndPassword {
  email: string;
  password: string;
  provider: 'email';
  firstName?: string;
  lastName?: string;
  otherName?: string;
}
