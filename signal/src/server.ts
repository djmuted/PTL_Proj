import express, { Application, json } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import path from "path";
import { JoinRoomRequest } from "./messages/joinRoomRequest";
import Redis from "ioredis";
import JSONCache from 'redis-json';
import kurento from 'kurento-client';
import register from 'kurento-client';
import { Room } from "./room";
import { ChangeNameRequest } from "./messages/changeNameRequest";
import { User } from "./user";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessageRequest } from "./messages/chatMessageRequest";
import { ChatMessageResponse } from "./messages/chatMessageResponse";
import { UserLeftResponse } from "./messages/userLeftResponse";
import { JoinRoomError } from "./messages/joinRoomError";
import { UserUpdatedResponse } from "./messages/userUpdatedResponse";
import { SignalUserResponse } from "./messages/signalUserResponse";
import { SignalUserRequest } from "./messages/signalUserRequest";
import { CreateRoomResponse } from "./messages/createRoomResponse";
import { JoinRoomResponse } from "./messages/joinRoomResponse";
import { UserJoinedResponse } from "./messages/userJoinedResponse";
import { ReceiveFeedRequest } from "./messages/receiveFeedRequest";
import { IceCandidateMessage } from "./iceCandidateMessage";

export class Server {
    private id: string;
    private httpServer: HTTPServer;
    private app: Application;
    private io: SocketIOServer;
    private db: Redis.Redis;
    private kurento: kurento.ClientInstance;

    private readonly DEFAULT_PORT = 5000;
    private readonly KURENTO_WS = 'ws://localhost:8890/kurento';

    private rooms: Map<string, Room>;

    constructor() {
        this.id = uuidv4();
        this.rooms = new Map<string, Room>();
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.db = new Redis();

        this.configureKurento();
        this.configureApp();
        this.configureRoutes();
        this.handleSocketConnection();
    }

    private async configureKurento() {
        this.kurento = await kurento(this.KURENTO_WS);
    }
    private configureApp(): void {
        this.app.use(express.static(path.join(__dirname, "../public")));
    }

    private configureRoutes(): void {
        this.app.get("/", (req, res) => {
            res.sendFile("index.html");
        });
    }
    private async CreateRoom(owner: User) {
        let room = new Room(uuidv4(), owner);
        room.pipeline = await this.kurento.create('MediaPipeline');
        this.rooms.set(room.id, room);
        await this.db.set("room:" + room.id, this.id);
        return room;
    }
    private async RemoveRoom(room: Room) {
        for (var _user of room.users.values()) {
            _user.socket.disconnect()
        }
        this.rooms.delete(room.id);
        room.pipeline.close();
        await this.db.del("room:" + room.id);
    }
    private async SendRoom(room: Room, key: string, value: any, excluseUser?: User) {
        for (var _user of room.users.values()) {
            if (_user != excluseUser)
                _user.socket.emit(key, value);
        }
    }
    private handleSocketConnection() {
        this.io.on("connection", socket => {
            let user = new User(uuidv4(), socket);
            let room: Room;

            socket.on("disconnect", async () => {
                if (room) {
                    room.users.delete(user.id);
                    this.SendRoom(room, "user_left", new UserLeftResponse(user.id));
                    if (!room.users.size) {
                        this.RemoveRoom(room);
                    }
                }
            });
            socket.on("create_room", async () => {
                room = await this.CreateRoom(user);
                room.users.set(user.id, user);
                socket.emit("create_room", new CreateRoomResponse(room.id));
            });
            socket.on("join_room", async (data: JoinRoomRequest) => {
                if (this.rooms.has(data.roomId)) {
                    room = this.rooms.get(data.roomId);
                    room.users.set(user.id, user);
                    user.outgoingMedia = await room.pipeline.create('WebRtcEndpoint');
                    user.outgoingMedia.setMaxVideoRecvBandwidth(300);
                    user.outgoingMedia.setMinVideoRecvBandwidth(100);

                    socket.emit("join_room", new JoinRoomResponse(room.id));
                    this.SendRoom(room, "user_joined", new UserJoinedResponse(user), user);
                } else {
                    socket.emit("join_room_error", new JoinRoomError(data.roomId, "Room could not be found or the meeting has ended."));
                }
            });
            socket.on("remove_room", () => {
                if (!room) return;
                if (room.owner == user)
                    this.RemoveRoom(room);
            });
            socket.on("change_name", (data: ChangeNameRequest) => {
                user.name = data.name;
                this.SendRoom(room, "user_updated", new UserUpdatedResponse(user));
            });
            socket.on("chat_message", (data: ChatMessageRequest) => {
                if (!room) return;
                this.SendRoom(room, "chat_message", new ChatMessageResponse(user.id, data.message), user);
            });
            socket.on("receive_from", async (data: ReceiveFeedRequest) => {
                let targetUser = room.users.get(data.target);
                if (targetUser) {
                    if (!user.incomingMedia.has(targetUser.id)) {
                        let endpoint = await room.pipeline.create('WebRtcEndpoint');
                        endpoint.setMaxVideoRecvBandwidth(300);
                        endpoint.setMinVideoRecvBandwidth(100);
                        user.incomingMedia.set(targetUser.id, endpoint);

                        if (user.iceCandidates.has(targetUser.id)) {
                            let iceCandidateQueue = user.iceCandidates.get(targetUser.id);
                            while (iceCandidateQueue.length) {
                                let message = iceCandidateQueue.shift();
                                console.log(`user: ${user.id} collect candidate for ${message.target}`);
                                endpoint.addIceCandidate(message.candidate);
                            }
                        }
                        endpoint.on('OnIceCandidate', event => {
                            // console.log(`generate incoming media candidate: ${userSession.id} from ${sender.id}`);
                            let candidate = register.getComplexType("IceCandidate")(event.candidate) as RTCIceCandidate;
                            socket.emit('ice_candidate', new IceCandidateMessage(targetUser.id, candidate));
                        });
                        await targetUser.outgoingMedia.connect(endpoint);
                    }
                }
            });
        });
    }
    public listen(callback: (port: number) => void): void {
        this.httpServer.listen(this.DEFAULT_PORT, () => {
            callback(this.DEFAULT_PORT);
        });
    }
}
