import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisAdapter } from 'socket.io-redis';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
