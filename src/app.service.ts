import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Injectable()
export class AppService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  getHello(): string {
    return 'Hello World!';
  }

  sentSocket(room: string, data: any): string {
    // Send message to WebSocket clients
    this.websocketGateway.sendMessage(room, data);
    return 'Message sent successfully';
  }
}
