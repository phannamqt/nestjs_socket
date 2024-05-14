import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logs: string[] = [];
  public readonly logger: Logger = new Logger('WebSocketGateway');

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.log('Client connected:' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.log('Client disconnected:' + client.id);
  }

  afterInit() {
    console.log('WebSocket gateway initialized');
    this.log('WebSocket gateway initialized');
  }

  async sendMessage(room: string, data: any) {
    console.log(`Attempting to send message to room ${room} with data:`, data);
    this.log(`Attempting to send message to room ${room} with data: ${data}`);
    const clients = await this.server.in(room).fetchSockets();
    if (clients.length > 0) {
      this.server.to(room).emit('message', data);
      console.log(`Message sent to room ${room}`);
      this.log(`Message sent to room ${room}`);
    } else {
      console.log(`Room ${room} does not exist or has no clients`);
      this.log(`Room ${room} does not exist or has no clients`);
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, data: any): Promise<any> {
    if (data) {
      console.log(
        `Client ${client.id} is attempting to join room ${data?.room} with data:`,
        data,
      );
      try {
        client.join(data?.room);
        this.log(`Client ${client.id} successfully joined room ${data?.room}`);
        this.server.to(data?.room).emit('joined', data);
        console.log('Emitted joined event to room', data?.room);
        this.log('Emitted joined event to room' + data?.room);
      } catch (error) {
        this.log(
          `Client ${client.id} failed to join room ${data?.room}: ${error}`,
        );
      }
    }
  }

  log(message: string) {
    this.logger.log(message);
    this.logs.push(this.getCurrentDateFormatted() + ': ' + message);
  }

  getLogs() {
    return this.logs;
  }

  resetLogs() {
    return (this.logs = []);
  }

  getCurrentDateFormatted() {
    const date = new Date();
    const datePart = date.toLocaleDateString('en-CA'); // 'en-CA' format results in 'YYYY-MM-DD'
    const timePart = date.toLocaleTimeString('it-IT'); // 'it-IT' format results in 'hh:mm:ss'
    return `${datePart} ${timePart}`;
  }
}
