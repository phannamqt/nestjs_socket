import { Global, Module } from '@nestjs/common';
import { BackendService } from './backend.service';
import { SocketModule } from '../socket/socket.module';

 
@Module({
    imports: [SocketModule], // Import SocketModule
    providers: [BackendService],
    exports: [BackendService],
  })
  export class BackendModule {}