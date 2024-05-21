import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from 'socket.io-redis';
import Redis from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  constructor(private readonly server: any) {
    super();
  }

  createIOServer(options?: any): any {
    const ioServer = super.createIOServer(this.server, options);
    const pubClient = new Redis({ host: 'redis', port: 6379 });
    const subClient = pubClient.duplicate();
    ioServer.adapter(createAdapter({ pubClient, subClient }));
    return ioServer;
  }
}