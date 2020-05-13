import { RedisEvent } from "./redisEvent";
import { User } from "../user";

export class SignalEvent extends RedisEvent {
    public source: string;
    public target: string;
    public sdp: any;

    constructor(_source: string, _target: string, _sdp: any) {
        super("signal");
        this.source = _source;
        this.target = _target;
        this.sdp = _sdp;
    }
}