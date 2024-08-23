import { ObjectLiteral } from '@common/interfaces/object-literal';
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('StringKeyJson')
export class StringKeyJsonScalar
  implements CustomScalar<ObjectLiteral, ObjectLiteral>
{
  description: 'An object with string keys only';

  parseValue(value: ObjectLiteral): ObjectLiteral {
    console.log('Incoming value in parseValue foo: ', value);

    return value;
  }

  serialize(value: ObjectLiteral): ObjectLiteral {
    console.log('Incoming value in serialize foo: ', value);
    return value;
  }

  parseLiteral(ast: ValueNode): ObjectLiteral {
    console.log('Incoming ast in parseLiteral foo: ', ast);
    if (ast.kind !== Kind.OBJECT) {
      throw new Error(
        'Invalid type: Metadata must be an object with string keys',
      );
    }
    const value: ObjectLiteral = {};
    ast.fields.forEach((field) => {
      if (typeof field.name.value !== 'string') {
        throw new Error('Invalid key: Metadata keys must be strings.');
      }
      value[field.name.value] = this.parseLiteral(field.value);
    });
    return value;
  }
}
