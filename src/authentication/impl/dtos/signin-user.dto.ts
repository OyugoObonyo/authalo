import { SignInUserWithEmailAndPassword } from '@authentication/interfaces/dtos/signin-user-dtos.interface';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SignInUserWithEmailAndPasswordDto
  implements SignInUserWithEmailAndPassword
{
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
