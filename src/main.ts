import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for WebSocket
  app.use(cors());

  // Use Socket.io adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Allow connections from all origins (or restrict as needed)
  app.enableCors({
    origin: '*',  // Change this to your frontend domain for security
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });

  app.enableCors(); // Enable CORS
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
