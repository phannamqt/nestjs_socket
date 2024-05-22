import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway'; // Adjust the path as necessary

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}