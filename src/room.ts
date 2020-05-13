import { User } from "./user";

export class Room {
    public id: string;
    public users: Array<User>;

    constructor(_id: string) {
        this.id = _id;
        this.users = [];
    }
}