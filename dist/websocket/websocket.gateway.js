"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let WebsocketGateway = class WebsocketGateway {
    constructor() {
        this.logs = [];
        this.logger = new common_1.Logger('WebSocketGateway');
    }
    handleConnection(client) {
        this.log('Client connected:' + client.id);
    }
    handleDisconnect(client) {
        this.log('Client disconnected:' + client.id);
    }
    afterInit() {
        console.log('WebSocket gateway initialized');
        this.log('WebSocket gateway initialized');
    }
    async sendMessage(room, data) {
        this.log(`Attempting to send message to room ${room} with data: ${data}`);
        const clients = await this.server.in(room).fetchSockets();
        if (clients.length > 0) {
            this.server.to(room).emit('message', data);
            this.log(`Message sent to room ${room}: ${data}`);
        }
        else {
            this.log(`Room ${room} does not exist or has no clients, with data: ${data}`);
        }
    }
    async joinRoom(client, data) {
        if (data) {
            this.log(`Client ${client.id} is attempting to join room ${data?.room} with data: ${JSON.stringify(data)}`);
            try {
                client.join(data?.room);
                this.log(`Client ${client.id} successfully joined room ${data?.room} with data: ${JSON.stringify(data)}`);
                this.server.to(data?.room).emit('joined', `Client ${client.id} successfully joined room ${data?.room} with data: ${JSON.stringify(data)}`);
                this.log(`Emitted client ${client.id} joined event to room ${data?.room} with data: ${JSON.stringify(data)}`);
            }
            catch (error) {
                this.log(`Client ${client.id} failed to join room ${data?.room}: ${error}`);
            }
        }
    }
    log(message) {
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
        const datePart = date.toLocaleDateString('en-CA');
        const timePart = date.toLocaleTimeString('it-IT');
        return `${datePart} ${timePart}`;
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], WebsocketGateway.prototype, "joinRoom", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map