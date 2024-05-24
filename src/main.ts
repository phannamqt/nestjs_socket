import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';
import * as crypto from 'crypto';
import {join} from 'path';
import { contentParser } from 'fastify-multer';

async function bootstrap() {
  process.env.NODE_INSTANCE_ID = crypto.randomBytes(16).toString('hex');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,  
      maxParamLength: 1000,
    }),
  );

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.setViewEngine({
    engine: {
      ejs: require('ejs'),
    },
    templates: join(__dirname, '../', 'views'),
    options: {
      async: true,
    },
  });

  app.useWebSocketAdapter(redisIoAdapter);
  await app.register(contentParser);
  await app.listen(3004,'0.0.0.0');
}

 bootstrap();