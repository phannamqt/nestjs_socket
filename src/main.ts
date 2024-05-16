import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';
import { RedisIoAdapter } from './redis/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set the directory where the views are stored
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  // Set the view engine to ejs
  app.setViewEngine('ejs');
  const io = app.get(RedisIoAdapter);
  app.useWebSocketAdapter(io);
  await app.listen(8000);
}
bootstrap();
