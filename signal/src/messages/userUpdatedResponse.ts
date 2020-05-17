import { UserData } from "../userData";

export class UserUpdatedResponse {
    public user: UserData;

    constructor(_user: UserData) {
        this.user = _user;
    }
}