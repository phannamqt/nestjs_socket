import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logs;
    readonly logger: Logger;
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    afterInit(): void;
    sendMessage(room: string, data: any): Promise<void>;
    log(message: string): void;
    getLogs(): string[];
    resetLogs(): any[];
    getCurrentDateFormatted(): string;
}
