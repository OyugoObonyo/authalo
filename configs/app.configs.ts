import { ObjectLiteral } from '@common/interfaces/object-literal';

export function appConfigsLoader(): ObjectLiteral {
  return {
    db: {
      postgresql: {
        name: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        password: process.env.DATABASE_PASSWORD,
        user: process.env.DATABASE_USER,
        port: parseInt(process.env.DATABASE_PORT),
      },
    },
    app: {
      port: process.env.PORT,
      env: process.env.NODE_ENV,
      dbSystem: process.env.DB_SYSTEM,
      debug: JSON.parse(process.env.NEST_DEBUG),
    },
  };
}
