import { RedisEvent } from "./redisEvent";

export class ChatEvent extends RedisEvent {
    public sender: string;
    public message: string;

    constructor(_sender: string, _message: string) {
        super("chat");
        this.sender = _sender;
        this.message = _message;
    }
}