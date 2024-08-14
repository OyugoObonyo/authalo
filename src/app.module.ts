import { AuthModule } from '@auth/auth.module';
import { appConfigsLoader } from '@configs/app.configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfigsLoader] }),
    // TODO: make db credentials dynamic such that the connection depends on the db system
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        database: config.get<string>('db.postgresql.name'),
        host: config.get<string>('db.postgresql.host'),
        port: config.get<number>('db.postgresql.port'),
        username: config.get<string>('db.postgresql.user'),
        password: config.get<string>('db.postgresql.password'),
        autoLoadEntities: true,
        migrations: ['dist/database/migrations/postgresql/*.js'],
        maxQueryExecutionTime: 1000,
        logging: ['error', 'info'],
        // TODO: implement custom logger that attaches actor id and timestamp
        logger: 'advanced-console',
        migrationsRun: true,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
