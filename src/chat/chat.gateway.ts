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
   
    // @SubscribeMessage('call-user')
    // handleIncomingCall(client: Socket, payload: { to: string; offer: any }) {
    //   this.server.emit('incoming-call', payload);
    // }

    @SubscribeMessage('call-user')
    handleCallUser(client: Socket, payload: { to: string, offer: RTCSessionDescriptionInit }) {
      // Handle initiating a call to another user
      this.server.to(payload.to).emit('incoming-call', { from: client.id, offer: payload.offer });
    }
      
    // @SubscribeMessage('answer')
    // handleAnswer(client: Socket, payload: any) {
    //   this.server.emit('answer', payload);
    // }

    @SubscribeMessage('answer-call')
    handleAnswerCall(client: Socket, payload: { to: string, answer: RTCSessionDescriptionInit }) {
      // Handle answering a call from another user
      this.server.to(payload.to).emit('call-accepted', { from: client.id, answer: payload.answer });
    }

    @SubscribeMessage('accept-call')
    handleAcceptCall(client: Socket, payload: any) {
      this.server.emit('offer', payload);
    }
  
    // @SubscribeMessage('answer')
    // handleAnswer(client: Socket, payload: any) {
    //   this.server.emit('answer', payload);
    // }
  
    // @SubscribeMessage('ice-candidate')
    // handleIceCandidate(client: Socket, payload: any) {
    //   this.server.emit('ice-candidate', payload);
    // }

    @SubscribeMessage('ice-candidate')
    handleIceCandidate(client: Socket, payload: { to: string, candidate: RTCIceCandidateInit }) {
        if (!payload.candidate) {
            console.warn("Received an invalid ICE candidate:", payload);
            return;
        }
        this.server.to(payload.to).emit('ice-candidate', payload.candidate);
    }
    
  }