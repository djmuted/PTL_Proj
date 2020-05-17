import { UserData } from "../userData";

export class UserJoinedResponse {
    public user: UserData;

    constructor(_user: UserData) {
        this.user = _user;
    }
}