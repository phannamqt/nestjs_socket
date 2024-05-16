"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path = require("path");
const redis_io_adapter_1 = require("./redis/redis-io.adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
    app.setViewEngine('ejs');
    app.useWebSocketAdapter(new redis_io_adapter_1.RedisIoAdapter(app));
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map