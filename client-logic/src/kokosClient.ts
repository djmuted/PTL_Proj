import * as io from 'socket.io-client';
import * as kurentoUtils from 'kurento-utils';
import { CreateRoomResponse } from './messages/createRoomResponse';
import { JoinRoomResponse } from './messages/joinRoomResponse';
import { JoinRoomRequest } from './messages/joinRoomRequest';
import { ChatMessageRequest } from './messages/chatMessageRequest';
import { ChatMessageResponse } from './messages/chatMessageResponse';
import { JoinRoomError } from './messages/joinRoomError';
import { UserJoinedResponse } from './messages/userJoinedResponse';
import { UserLeftResponse } from './messages/userLeftResponse';
import { UserUpdatedResponse } from './messages/userUpdatedResponse';
import { UserData } from './userData';
import { Participant } from './participant';
import { IceCandidateMessage } from './iceCandidateMessage';
import { ReceiveFeedRequest } from './messages/receiveFeedRequest';

export class KokosClient {
    private wsUrl: string;
    private socket: SocketIOClient.Socket;
    private user: UserData;
    private participants: Map<string, Participant>;

    constructor(_wsUrl: string) {
        this.wsUrl = _wsUrl;
        this.participants = new Map<string, Participant>();
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
    public CreateRoom(): Promise<CreateRoomResponse> {
        return new Promise((resolve, reject) => {
            let handler = (data: CreateRoomResponse) => {
                this.socket.off("create_room", handler);
                resolve(data);
            }
            this.socket.on("create_room", handler);
            this.socket.emit("create_room", {});
        });
    }
    public JoinRoom(roomId: string): Promise<JoinRoomResponse> {
        return new Promise((resolve, reject) => {
            let handler = (data: JoinRoomResponse) => {
                disableHandlers();
                resolve(data);
            }
            let handlerErr = (data: JoinRoomError) => {
                disableHandlers();
                reject(data);
            }
            let disableHandlers = () => {
                this.socket.off("join_room", handler);
                this.socket.off("join_room_error", handlerErr);
            }
            this.socket.on("join_room", handler);
            this.socket.on("join_room_error", handlerErr);
            this.socket.emit("join_room", new JoinRoomRequest(roomId));
        });
    }
    public Chat(message: string) {
        this.socket.emit("chat_message", new ChatMessageRequest(message));
    }
    public HandleServerEvent() {
        this.socket.on("create_room", (data: CreateRoomResponse) => {
            console.log(`room created, id: ${data.id}`);
            this.participants = new Map<string, Participant>();
            this.participants.set(data.owner.id, new Participant(data.owner));
            this.user = data.owner;
        });
        this.socket.on("join_room", (data: JoinRoomResponse) => {
            console.log(`room joined, id: ${data.roomId}`);
            this.participants = new Map<string, Participant>();
            this.user = data.user;
            for (let userData of data.users) {
                let participant = new Participant(userData);
                this.participants.set(userData.id, participant);
                participant.receiveVideo(this.socket);
            }
        });
        this.socket.on("chat_message", (data: ChatMessageResponse) => {
            console.log(`chat message (sent by ${data.user}): ${data.message}`);
        });
        this.socket.on("user_joined", (data: UserJoinedResponse) => {
            console.log(`user ${data.user.id} joined.`);
            let participant = new Participant(data.user);
            this.participants.set(data.user.id, participant);
            participant.receiveVideo(this.socket);
        });
        this.socket.on("user_left", (data: UserLeftResponse) => {
            console.log(`user ${data.user} left.`);
            this.participants.delete(data.user);
        });
        this.socket.on("user_updated", (data: UserUpdatedResponse) => {
            console.log(`user ${data.user.id} updated its name: ${data.user.name}.`);
            this.participants.get(data.user.id).userData = data.user;
        });
        this.socket.on("ice_candidate", (data: IceCandidateMessage) => {
            console.log(`ice candidate for user: ${data.target}.`);
            this.participants.get(data.target).rtcPeer.addIceCandidate(data.candidate);
        });
        this.socket.on("receive_video_answer", (data: ReceiveFeedRequest) => {
            console.log(`ice candidate for user: ${data.target}.`);
            this.participants.get(data.target).rtcPeer.processAnswer(data.sdp);
        });
    }
}