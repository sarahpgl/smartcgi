import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GameIoAdapter } from './websocket/game-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new GameIoAdapter(app));


  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(9000);
}
bootstrap();
