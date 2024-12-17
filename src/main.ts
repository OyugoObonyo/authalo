import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@src/app.module';
import { VIEWS_DIR_PATH } from './app.constants';

console.log('Views Directory:  ', VIEWS_DIR_PATH);
// TODO: enable application shutdown hooks
// TODO: Enable debugging
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(VIEWS_DIR_PATH);
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.listen(process.env.PORT);
}
bootstrap();
