/* eslint-disable @typescript-eslint/no-unused-vars */
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
 
@WebSocketGateway()
export class SocketGateway {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private redis: Redis,
  ) {}
  // implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  @WebSocketServer()
  server: Server;
  private logs: string[] = [];
  public readonly logger: Logger = new Logger('WebSocketGateway');


  afterInit(server: any) {
    this.log('Method not implemented.');
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

  async sendMessage(room: string, data: any) {
    console.log('sendMessagesendMessage',data);
    
    this.log(`Attempting to send message to room ${room} with data: ${data}`);
      this.server.to(room).emit('message', data);
      this.log(`Message sent to room ${room}: ${data}`);
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
