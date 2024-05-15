import { WebsocketGateway } from './websocket/websocket.gateway';
export declare class AppService {
    private readonly websocketGateway;
    constructor(websocketGateway: WebsocketGateway);
    getHello(): string;
    sentSocket(room: string, data: any): string;
    getLogs(): any;
    resetLogs(): any;
}
