import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ObjectLiteral } from '@common/interfaces/object-literal';
import {
  GraphQLScalarValueParser,
  GraphQLScalarSerializer,
  GraphQLScalarLiteralParser,
} from 'graphql';

@Scalar('StringKeyJson')
export class StringKeyJson
  implements CustomScalar<ObjectLiteral, ObjectLiteral>
{
  description: 'An object with string keys only';
  parseValue: GraphQLScalarValueParser<ObjectLiteral>;
  serialize: GraphQLScalarSerializer<ObjectLiteral>;
  parseLiteral: GraphQLScalarLiteralParser<ObjectLiteral>;
}
