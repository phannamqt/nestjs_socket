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
        console.log('WebSocket gateway initialized.');
        this.log('WebSocket gateway initialized.');
    }
    async sendMessage(room, data) {
        this.log(`Attempting to send message to room ${room} with data: ${data}`);
        const roomExists = await this.server.in(room).allSockets();
        if (roomExists.size > 0) {
            const clients = await this.server.in(room).fetchSockets();
            this.server.to(room).emit('message', data);
            this.log(`Message sent to room ${room}: ${data}`);
        }
        else {
            this.log(`Room ${room} does not exist or has no clients, with data: ${data}`);
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
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map