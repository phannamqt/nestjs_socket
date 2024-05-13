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

  sendMessage(room: string, data: any) {
    // Send message to all clients in the specified room
    this.server.to(room).emit('message', data);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, data: any): Promise<any> {
    if (data) {
      client.join(data?.room);
      this.server.to(data?.room).emit('joined', data);
      console.log('joined');
    }
  }
}
