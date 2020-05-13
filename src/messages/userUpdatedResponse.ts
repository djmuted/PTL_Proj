import { User } from "../user";

export class UserUpdatedResponse {
    public user: User;

    constructor(_user: User) {
        this.user = _user;
    }
}