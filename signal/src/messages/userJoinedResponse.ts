import { User } from "../user";

export class UserJoinedResponse {
    public user: User;

    constructor(_user: User) {
        this.user = _user;
    }
}