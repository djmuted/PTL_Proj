import express, { Application, json } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import path from "path";
import { JoinRoomRequest } from "./messages/joinRoomRequest";
import Redis from "ioredis";
import JSONCache from 'redis-json';
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
import { WebRTC } from "./webRTC";

export class Server {
    private id: string;
    private httpServer: HTTPServer;
    private app: Application;
    private io: SocketIOServer;
    private db: Redis.Redis;
    private webRTC: WebRTC;

    private readonly DEFAULT_PORT = 5000;

    private rooms: Map<string, Room>;

    constructor() {
        this.id = uuidv4();
        this.rooms = new Map<string, Room>();
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.db = new Redis();
        this.webRTC = new WebRTC();

        this.webRTC.ConfigureWebRTC();
        this.configureApp();
        this.configureRoutes();
        this.handleSocketConnection();
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
        this.webRTC.OnCreateRoom(room);
        this.rooms.set(room.id, room);
        await this.db.set("room:" + room.id, this.id);
        return room;
    }
    private async RemoveRoom(room: Room) {
        for (var _user of room.users.values()) {
            _user.socket.disconnect()
        }
        this.rooms.delete(room.id);
        this.webRTC.OnRemoveRoom(room);
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

            socket.on("disconnect", async () => {
                if (user.room) {
                    user.room.users.delete(user.id);
                    this.SendRoom(user.room, "user_left", new UserLeftResponse(user.id));
                    if (!user.room.users.size) {
                        this.RemoveRoom(user.room);
                    }
                }
            });
            socket.on("create_room", async () => {
                let room = await this.CreateRoom(user);
                room.users.set(user.id, user);
                user.room = room;
                this.webRTC.OnJoinRoom(user, room);
                socket.emit("create_room", new CreateRoomResponse(room.id));
            });
            socket.on("join_room", async (data: JoinRoomRequest) => {
                if (this.rooms.has(data.roomId)) {
                    user.room = this.rooms.get(data.roomId);
                    user.room.users.set(user.id, user);
                    this.webRTC.OnJoinRoom(user, user.room);

                    socket.emit("join_room", new JoinRoomResponse(user.room));
                    this.SendRoom(user.room, "user_joined", new UserJoinedResponse(user), user);
                } else {
                    socket.emit("join_room_error", new JoinRoomError(data.roomId, "Room could not be found or the meeting has ended."));
                }
            });
            socket.on("remove_room", () => {
                if (!user.room) return;
                if (user.room.owner == user)
                    this.RemoveRoom(user.room);
            });
            socket.on("change_name", (data: ChangeNameRequest) => {
                user.name = data.name;
                this.SendRoom(user.room, "user_updated", new UserUpdatedResponse(user));
            });
            socket.on("chat_message", (data: ChatMessageRequest) => {
                if (!user.room) return;
                this.SendRoom(user.room, "chat_message", new ChatMessageResponse(user.id, data.message), user);
            });
            this.webRTC.ConfigureHandlers(user);
        });
    }
    public listen(callback: (port: number) => void): void {
        this.httpServer.listen(this.DEFAULT_PORT, () => {
            callback(this.DEFAULT_PORT);
        });
    }
}
