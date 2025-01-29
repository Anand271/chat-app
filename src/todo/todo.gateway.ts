import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@WebSocketGateway({ cors: true })
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
      @WebSocketServer()
      server: Server;
      
  constructor(private readonly todoService: TodoService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected todo: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected todo: ${client.id}`);
  }
  @SubscribeMessage('createTodoInBE')
  create(@MessageBody() createTodoDto: CreateTodoDto) {
    const response = this.todoService.create(createTodoDto);
    this.server.emit('findAllTodoInFE', this.findAll());
  }


  findAll() {
    return this.todoService.findAll();
  }

  @SubscribeMessage('findAllTodoInBE')
  findAllWithEmit() {
    this.server.emit('findAllTodoInFE', this.findAll());
  }

  @SubscribeMessage('findOneTodo')
  findOne(@MessageBody() id: number) {
    console.log('inside find one todo', id);
    return this.todoService.findOne(id);
  }

  @SubscribeMessage('updateTodoInBE')
  update(@MessageBody() updateTodoDto: UpdateTodoDto) {
    this.todoService.update(updateTodoDto.id, updateTodoDto);
    this.server.emit('findAllTodoInFE', this.findAll());
  }

  @SubscribeMessage('removeTodoInBE')
  remove(@MessageBody() id: number) {
    this.todoService.remove(id);
    this.server.emit('findAllTodoInFE', this.findAll());
  }
}
