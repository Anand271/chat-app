import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: { sender: string; message: string, time: Date }) {
      this.server.emit('message', payload); // Broadcast to all clients
    }
  
    @SubscribeMessage('offer')
    handleOffer(client: Socket, payload: any) {
      this.server.emit('offer', payload);
    }
  
    @SubscribeMessage('answer')
    handleAnswer(client: Socket, payload: any) {
      this.server.emit('answer', payload);
    }
  
    @SubscribeMessage('ice-candidate')
    handleIceCandidate(client: Socket, payload: any) {
      this.server.emit('ice-candidate', payload);
    }
  }