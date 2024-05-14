import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  async sendMessage(room: string, data: any) {
    console.log(`Attempting to send message to room ${room} with data:`, data);
    const clients = await this.server.in(room).fetchSockets();
    if (clients.length > 0) {
      this.server.to(room).emit('message', data);
      console.log(`Message sent to room ${room}`);
    } else {
      console.log(`Room ${room} does not exist or has no clients`);
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
        console.log(
          `Client ${client.id} successfully joined room ${data?.room}`,
        );
        this.server.to(data?.room).emit('joined', data);
        console.log('Emitted joined event to room', data?.room);
      } catch (error) {
        console.error(
          `Client ${client.id} failed to join room ${data?.room}:`,
          error,
        );
      }
    }
  }
}
