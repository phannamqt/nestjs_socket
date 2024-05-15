import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    showClient(roomId: string, data: string): {
        roomId: string;
        data: string;
    };
    getSocket(roomId: string, data: string): string;
    getLogs(): unknown;
    resetLogs(): string;
}
