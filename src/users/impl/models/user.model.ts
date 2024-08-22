import { ObjectLiteral } from '@common/interfaces/object-literal';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@users/interfaces/user.interface';

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  id: string;

  @Field()
  passwordHash: string;

  @Field()
  provider: string;

  @Field()
  isActive: boolean;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  otherName: string;

  @Field()
  metadata: ObjectLiteral;

  @Field()
  email: string;

  @Field()
  emailConfirmedAt: Date;

  @Field()
  bannedUntil: Date;

  @Field()
  lastLoginAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
