import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';
import * as crypto from 'crypto';
import * as path from 'path';

async function bootstrap() {
  process.env.NODE_INSTANCE_ID = crypto.randomBytes(16).toString('hex');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  // Set the directory where the views are stored
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  // Set the view engine to ejs
  app.setViewEngine('ejs');
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(3004);
}
bootstrap();