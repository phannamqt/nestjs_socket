import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private redis: Redis,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/client/:roomId/:data')
  @Render('index')
  async showClient(@Param('roomId') roomId: string, @Param('data') data: string) {
    const roomIdSocket = await this.redis.get('roomId')
    const dataSocket = await this.redis.get('data')
    
    return { roomId:roomIdSocket, data:dataSocket };
  }

  @Get('/socket/:roomId/:data')
  async getSocket(
    @Param('roomId') roomId: string,
    @Param('data') data: string,
  ) {
    await this.redis.set('roomId',roomId)
    await this.redis.set('data',data)
    return this.appService.sentSocket(roomId, data);
  }

  @Get('/logs')
  @Render('logs')
  async getLogs() {
    const data = await this.appService.getLogs();
    return { data };
  }

  @Get('/reset-log')
  resetLogs(): string {
    const data = this.appService.resetLogs();
    return JSON.stringify(data);
  }
}
