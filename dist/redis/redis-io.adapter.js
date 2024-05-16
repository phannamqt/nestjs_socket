"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const socket_io_redis_1 = require("socket.io-redis");
const ioredis_1 = require("ioredis");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        const pubClient = new ioredis_1.default({ host: 'redis', port: 6379 });
        const subClient = pubClient.duplicate();
        server.adapter((0, socket_io_redis_1.createAdapter)({ pubClient, subClient }));
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map