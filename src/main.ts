import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';

// TODO: enable application shutdown hooks
// TODO: Enable debugging
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.listen(process.env.PORT);
}
bootstrap();
