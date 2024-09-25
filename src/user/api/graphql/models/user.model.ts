import { StringKeyJsonScalar } from '@common/graphql/scalars/string-key-json.scalar';
import { ObjectLiteral } from '@common/interfaces/object-literal';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@user/interfaces/user.interface';

// @ObjectType()
// export class UserModel implements User {
//   @Field(() => ID)
//   id: string;

//   @Field()
//   provider: string;

//   @Field()
//   isActive: boolean;

//   @Field({ nullable: true })
//   firstName: string;

//   @Field({ nullable: true })
//   lastName: string;

//   @Field({ nullable: true })
//   otherName: string;

//   @Field(() => StringKeyJsonScalar, { nullable: true })
//   metadata: ObjectLiteral;

//   @Field({ nullable: true })
//   email: string;

//   @Field({ nullable: true })
//   emailConfirmedAt: Date;

//   @Field({ nullable: true })
//   bannedUntil: Date;

//   @Field({ nullable: true })
//   lastLoginAt: Date;

//   @Field({ nullable: true })
//   createdAt?: Date;

//   @Field({ nullable: true })
//   updatedAt?: Date;
// }

// NOTES: Leverage nestjs/graphql plugin to minimize written boilerplate code
@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  id: string;
  provider: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  otherName?: string;
  @Field(() => StringKeyJsonScalar, { nullable: true })
  metadata?: ObjectLiteral;
  email?: string;
  emailConfirmedAt?: Date;
  bannedUntil?: Date;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
