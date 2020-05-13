import { RedisEvent } from "./redisEvent";

export class UserLeftEvent extends RedisEvent {
    public user: string;

    constructor(_user: string) {
        super("userLeft");
        this.user = _user;
    }
}