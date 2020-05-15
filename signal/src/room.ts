import { User } from "./user";
import { MediaPipeline } from "kurento-client";

export class Room {
    public id: string;
    public users: Map<string, User>;
    public owner: User;
    public pipeline: MediaPipeline;

    constructor(_id: string, _owner: User) {
        this.id = _id;
        this.owner = _owner;
        this.users = new Map<string, User>();
    }
}