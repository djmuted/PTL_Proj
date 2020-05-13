import { RedisEvent } from "./redisEvent";
import { User } from "../user";

export class UserJoinedEvent extends RedisEvent {
    public user: User;

    constructor(_user: User) {
        super("userJoined");
        this.user = _user;
    }
}