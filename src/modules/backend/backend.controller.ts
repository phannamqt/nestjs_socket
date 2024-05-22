import { Controller, Get, Param, Render } from '@nestjs/common';
import Redis from 'ioredis';
import { BackendService } from './backend.service';

@Controller('backend')
export class BackendController {
  constructor(
    private readonly appService: BackendService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/client/:roomId/:data')
  @Render('index')
  async showClient(@Param('roomId') roomId: string, @Param('data') data: string) {
    
    return { roomId:roomId, data:data };
  }

  @Get('/socket/:roomId/:data')
  async getSocket(
    @Param('roomId') roomId: string,
    @Param('data') data: string,
  ) {
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
