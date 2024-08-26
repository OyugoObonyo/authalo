import { ObjectLiteral } from '@common/interfaces/object-literal';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StringKeyJsonScalar } from '@common/graphql/scalars/string-key-json.scalar';
import { User } from '@users/interfaces/user.interface';
import { Timestamps } from '@db/embeds/timestamps.embed';

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  id: string;

  @Field()
  provider: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  otherName: string;

  @Field(() => StringKeyJsonScalar, { nullable: true })
  metadata: ObjectLiteral;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  emailConfirmedAt: Date;

  @Field({ nullable: true })
  bannedUntil: Date;

  @Field({ nullable: true })
  lastLoginAt: Date;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
