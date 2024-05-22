import { Module } from '@nestjs/common'; 
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { SocketModule } from './modules/socket/socket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BackendController } from './modules/backend/backend.controller';
import { BackendModule } from './modules/backend/backend.module';

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
  imports: [SocketModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = 'redis'
        const port = 6379
        return {
          config: {
            host,
            port,
          },
        };
      },
      inject: [ConfigService],
    }), CacheModule.registerAsync(RedisOptions),
  
  BackendModule,
  SocketModule
  ],
  controllers: [BackendController],
})
export class AppModule {}
