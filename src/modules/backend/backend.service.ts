import { Injectable } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class BackendService {
  constructor(private readonly websocketGateway: SocketGateway) {} // Inject SocketGateway

  getHello(): string {
    return 'Hello World!';
  }

  sentSocket(room: string, data: any): string {
    // Send message to WebSocket clients
    this.websocketGateway.sendMessage(room, data);
    return `Message sent data ${data} to ${room} successfully`;
  }

  getLogs(): any {
    const data = this.websocketGateway.getLogs();
    return data;
  }

  resetLogs(): any {
    this.websocketGateway.resetLogs();
    return { data: 'Reset logs' };
  }
}
