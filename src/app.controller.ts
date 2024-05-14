import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/client/:roomId/:data')
  @Render('index')
  showClient(@Param('roomId') roomId: string, @Param('data') data: string) {
    return { roomId, data };
  }

  @Get('/socket/:roomId/:data')
  getSocket(
    @Param('roomId') roomId: string,
    @Param('data') data: string,
  ): string {
    return this.appService.sentSocket(roomId, data);
  }
}
