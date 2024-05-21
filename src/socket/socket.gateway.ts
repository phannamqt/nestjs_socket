/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import { SocketPayload } from './socket.constant';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logs: string[] = [];
  public readonly logger: Logger = new Logger('WebSocketGateway');

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  afterInit(server: any) {
    this.log('Method not implemented.');
  }

  //************************************** */

  // use redis to manage socket id across instances using uerId
  async addSocketId(userId: string, socketId: string): Promise<void> {
    const socketIds = await this.getSocketId(userId);

    if (socketIds && Array.isArray(socketIds) && socketIds.length) {
      socketIds.push(socketId);
      await this.cacheManager.set(`userId:${userId}`, [...new Set(socketIds)]);
    } else {
      await this.cacheManager.set(`userId:${userId}`, [socketId]);
    }
    await this.cacheManager.set(`socketId:${socketId}`, userId);
  }

  async getSocketId(userId: string): Promise<string[] | null> {
    return this.cacheManager.get(`userId:${userId}`);
  }

  async getUserId(socketId: string): Promise<string | null> {
    return this.cacheManager.get(`socketId:${socketId}`);
  }

  async removeUserId(socketId: string): Promise<string> {
    const userId = await this.getUserId(socketId);
    const socketIds = await this.getSocketId(userId);

    if (socketIds) {
      const updatedSocketIds = socketIds.filter((id) => id !== socketId);

      if (updatedSocketIds.length > 0) {
        await this.cacheManager.set(`userId:${userId}`, updatedSocketIds);
      } else {
        await this.cacheManager.del(`userId:${userId}`);
      }
    }
    await this.cacheManager.del(`socketId:${socketId}`);

    return userId;
  }

  //************************************** */

  // On User Connect
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;

    await this.addSocketId(userId as string, client.id);

    console.log(`Connected with:`, userId);

    const receiverSocketId = await this.getSocketId(userId as string);
    if (receiverSocketId)
      this.server.to(receiverSocketId).emit('connected_instance', {
        instance: process.env.NODE_INSTANCE_ID,
      });
  }

  // On User Disconnect
  async handleDisconnect(client: Socket) {
    const userId = await this.removeUserId(client.id);
    console.log(`Disconnected with:`, userId);
  }

  sendMessageToAll(event: string, data: SocketPayload) {
    this.server.emit(event, data.message);
  }

  async sendMessageSpecificUser(event: string, data: SocketPayload) {
    const receiverSocketId = await this.getSocketId(data.userId);
    receiverSocketId.forEach((id) => {
      this.server.to(id).emit(event, data.message);
    });
  }

  // all messages sent from client side

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { userId: string; message: string },
  ) {
    const receiverSocketId = await this.getSocketId(data.userId);
    this.server.to(receiverSocketId).emit('message', {
      message: data.message,
      instance: process.env.NODE_INSTANCE_ID,
    });
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
