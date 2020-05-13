import express, { Application, json } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import path from "path";
import { JoinRoomRequest } from "./messages/joinRoomRequest";
import * as handyRedis from "handy-redis";
import * as redis from "redis";
import { Room } from "./room";
import { ChangeNameRequest } from "./messages/changeNameRequest";
import { User } from "./user";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessageRequest } from "./messages/chatMessageRequest";
import { ChatMessageResponse } from "./messages/chatMessageResponse";
import { ChatEvent } from "./redisEvents/chatEvent";
import { RedisEvent } from "./redisEvents/redisEvent";
import { UserJoinedEvent } from "./redisEvents/userJoinedEvent";
import { UserLeftEvent } from "./redisEvents/userLeftEvent";
import { UserLeftResponse } from "./messages/userLeftResponse";
import { JoinRoomError } from "./messages/joinRoomError";
import { UserUpdatedEvent } from "./redisEvents/userUpdatedEvent";
import { UserUpdatedResponse } from "./messages/userUpdatedResponse";
import { SignalEvent } from "./redisEvents/signalEvent";
import { SignalUserResponse } from "./messages/signalUserResponse";
import { SignalUserRequest } from "./messages/signalUserRequest";

export class Server {
    private httpServer: HTTPServer;
    private app: Application;
    private io: SocketIOServer;
    private db: handyRedis.IHandyRedis;
    private subscriber: redis.RedisClient;

    private readonly DEFAULT_PORT = 5000;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.db = handyRedis.createHandyClient();
        this.subscriber = redis.createClient();

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
    private async GetRoom(roomId: string) {
        if (await this.db.exists(roomId)) {
            var roomStr = await this.db.get(roomId);
            if (roomStr != null) {
                return JSON.parse(roomStr) as Room;
            }
        }
        return null;
    }
    private handleSocketConnection() {
        this.io.on("connection", socket => {
            let user = new User(uuidv4());
            let room: Room;

            var redisCallback = async (channel: string, json: string) => {
                let _room = await this.GetRoom(room.id);
                if (_room != null) {
                    room = _room;
                }
                if (channel == room.id + "_event") {
                    let evt = JSON.parse(json) as RedisEvent;
                    this.OnRedisEvent(socket, user, room, evt);
                }
            }

            socket.on("disconnect", async () => {
                this.db.publish(room.id + "_event", JSON.stringify(new UserLeftEvent(user.id)));
                this.subscriber.off("message", redisCallback);
                let _room = await this.GetRoom(room.id);
                if (_room != null) {
                    room = _room;
                    for (var i in room.users) {
                        if (room.users[i].id == user.id) {
                            delete room.users[i];
                            break;
                        }
                    }
                    this.db.set(room.id, JSON.stringify(room));
                }
            });
            socket.on("create_room", async () => {
                room = new Room(uuidv4());
                room.users.push(user);
                this.db.set(room.id, JSON.stringify(room));
                this.subscriber.subscribe(room.id + "_event");
            });
            socket.on("join_room", async (data: JoinRoomRequest) => {
                let _room = await this.GetRoom(data.roomId);
                if (_room != null) {
                    room = _room;
                    room.users.push(user);
                    this.db.set(room.id, JSON.stringify(room));
                    this.subscriber.subscribe(room.id + "_event");
                    this.db.publish(room.id + "_event", JSON.stringify(new UserJoinedEvent(user)));
                } else {
                    socket.emit("join_room_error", new JoinRoomError(data.roomId, "Room could not be found or the meeting is gone."));
                }
            });
            socket.on("change_name", async (data: ChangeNameRequest) => {
                user.name = data.name;
                this.db.publish(room.id + "_event", JSON.stringify(new UserUpdatedEvent(user)));
            });
            socket.on("chat_message", async (data: ChatMessageRequest) => {
                let evt = new ChatEvent(user.id, data.message);
                this.db.publish(room.id + "_event", JSON.stringify(evt));
            });
            socket.on("signal", async (data: SignalUserRequest) => {
                let evt = new SignalEvent(user.id, data.userId, data.sdp);
                this.db.publish(room.id + "_event", JSON.stringify(evt));
            });
            this.subscriber.on("message", redisCallback);

        });
    }
    private async OnRedisEvent(socket: socketIO.Socket, user: User, room: Room, event: RedisEvent) {
        switch (event.type) {
            case "chat": {
                let evt = event as ChatEvent;
                socket.emit("chat_message", new ChatMessageResponse(evt.sender, evt.message));
                break;
            }
            case "userJoined": {
                let evt = event as UserJoinedEvent;
                socket.emit("user_joined", new UserJoinedEvent(evt.user));
                break;
            }
            case "userUpdated": {
                let evt = event as UserUpdatedEvent;
                socket.emit("user_updated", new UserUpdatedResponse(evt.user));
                break;
            }
            case "userLeft": {
                let evt = event as UserLeftEvent;
                socket.emit("user_left", new UserLeftResponse(evt.user));
                break;
            }
            case "signal": {
                let evt = event as SignalEvent;
                if (user.id == evt.target) {
                    socket.emit("signal", new SignalUserResponse(evt.source, evt.sdp));
                }
                break;
            }
        }
    }
    public listen(callback: (port: number) => void): void {
        this.httpServer.listen(this.DEFAULT_PORT, () => {
            callback(this.DEFAULT_PORT);
        });
    }
}
