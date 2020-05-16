import { User } from "./user";

export class UserData {
    public id: string;
    public name: string;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
    }
}