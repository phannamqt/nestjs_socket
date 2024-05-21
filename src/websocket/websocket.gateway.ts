import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import Redis from 'ioredis';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logs: string[] = [];
  public readonly logger: Logger = new Logger('WebSocketGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    const pubClient = new Redis({ host: 'redis', port: 6379 });
    const subClient = pubClient.duplicate();
    this.server.adapter(createAdapter({ pubClient, subClient }));

    this.log('WebSocket gateway initialized with Redis adapter.');
    console.log('WebSocket gateway initialized with Redis adapter.');
  }

  handleConnection(client: Socket) {
    this.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.log('Client disconnected: ' + client.id);
  }

  async sendMessage(room: string, data: any) {
    this.log(`Attempting to send message to room ${room} with data: ${data}`);
    const roomExists = await this.server.in(room).allSockets();
    if (roomExists.size > 0) {
      this.server.to(room).emit('message', data);
      this.log(`Message sent to room ${room}: ${data}`);
    } else {
      this.log(`Room ${room} does not exist or has no clients, with data: ${data}`);
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, data: any): Promise<void> {
    if (data && data.room) {
      this.log(`Client ${client.id} is attempting to join room ${data.room} with data: ${JSON.stringify(data)}`);
      try {
        client.join(data.room);
        this.log(`Client ${client.id} successfully joined room ${data.room}`);
        this.server.to(data.room).emit('joined', `Client ${client.id} successfully joined room ${data.room}`);
      } catch (error) {
        this.log(`Client ${client.id} failed to join room ${data.room}: ${error}`);
      }
    } else {
      this.log(`Client ${client.id} provided invalid data for joining room: ${JSON.stringify(data)}`);
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
