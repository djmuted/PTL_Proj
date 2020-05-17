import { UserData } from "../userData";

export class CreateRoomResponse {
    public id: string;
    public owner: UserData;

    constructor(_id: string, _owner: UserData) {
        this.id = _id;
        this.owner = _owner;
    }
}