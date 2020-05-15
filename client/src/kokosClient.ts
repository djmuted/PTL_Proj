import * as io from 'socket.io-client';
import { CreateRoomResponse } from './messages/createRoomResponse';
import { JoinRoomResponse } from './messages/joinRoomResponse';
import { JoinRoomRequest } from './messages/joinRoomRequest';
import { ChatMessageRequest } from './messages/chatMessageRequest';
import { ChatMessageResponse } from './messages/chatMessageResponse';

export class KokosClient {
    private wsUrl: string;
    private socket: SocketIOClient.Socket;

    private peerConnection = new RTCPeerConnection({
        iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
    });

    constructor(_wsUrl: string) {
        this.wsUrl = _wsUrl;
        this.socket = io.connect(this.wsUrl);
        this.socket.on("connect", () => {
            this.HandleServerEvent();
            console.log("connected: " + this.socket.connected);
        });
        //for debugging
        (window as any).createRoom = () => this.CreateRoom();
        (window as any).joinRoom = (rid: string) => this.JoinRoom(rid);
        (window as any).chat = (rid: string) => this.Chat(rid);
    }
    public async CreateRoom() {
        this.socket.emit("create_room", {});
    }
    public async JoinRoom(roomId: string) {
        this.socket.emit("join_room", new JoinRoomRequest(roomId));
    }
    public async Chat(message: string) {
        this.socket.emit("chat_message", new ChatMessageRequest(message));
    }
    public HandleServerEvent() {
        this.socket.on("create_room", (data: CreateRoomResponse) => {
            console.log("room created, id: " + data.id);
        });
        this.socket.on("join_room", (data: JoinRoomResponse) => {
            console.log("room joined, id: " + data.roomId);
        });
        this.socket.on("chat_message", (data: ChatMessageResponse) => {
            console.log("chat message (sent by " + data.user + "):" + data.message);
        });
    }
}