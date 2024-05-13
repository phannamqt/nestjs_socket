import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/socket/:room/:data')
  getSocket(@Param('room') room: string, @Param('data') data: string): string {
    return this.appService.sentSocket(room, data);
  }
}
