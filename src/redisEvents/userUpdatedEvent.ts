import { RedisEvent } from "./redisEvent";
import { User } from "../user";

export class UserUpdatedEvent extends RedisEvent {
    public user: User;

    constructor(_user: User) {
        super("userUpdated");
        this.user = _user;
    }
}