import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreateUserWithEmailAndPassword } from '@users/interfaces/dtos/create-user-dtos.interface';
import { MINIMUM_USER_PASSWORD_LENGTH } from '@users/user.constants';

export class CreateUserWithEmailAndPasswordDto
  implements CreateUserWithEmailAndPassword
{
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(MINIMUM_USER_PASSWORD_LENGTH)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  provider: 'email';

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  otherName?: string;
}
