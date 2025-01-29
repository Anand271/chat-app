import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { TodoModule } from './todo/todo.module';
import { TodoGateway } from './todo/todo.gateway';

@Module({
  imports: [TodoModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
