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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("./websocket/websocket.gateway");
let AppService = class AppService {
    constructor(websocketGateway) {
        this.websocketGateway = websocketGateway;
    }
    getHello() {
        return 'Hello World!';
    }
    sentSocket(room, data) {
        this.websocketGateway.sendMessage(room, data);
        return `Message sent data ${data} to ${room} successfully`;
    }
    getLogs() {
        const data = this.websocketGateway.getLogs();
        return data;
    }
    resetLogs() {
        this.websocketGateway.resetLogs();
        return { data: 'Reset logs' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [websocket_gateway_1.WebsocketGateway])
], AppService);
//# sourceMappingURL=app.service.js.map