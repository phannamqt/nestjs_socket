import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const REDIS_HOST = process.env.REDIS_HOST || 'redis';
    const REDIS_PORT = process.env.REDIS_PORT || 6379;
    const store = await redisStore({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });
    return {
      store: () => store,
      ttl: 86400000, // 1 Day = 24 * 60 * 60 * 1000 = 86,400,000 milliseconds.
    };
  },
};

@Module({
  imports: [SocketModule, CacheModule.registerAsync(RedisOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
