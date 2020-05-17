import { UserData } from "../userData";
import { Room } from "../room";

export class JoinRoomResponse {
    public roomId: string;
    public user: UserData;
    public users: Array<UserData>;

    constructor(room: Room, _user: UserData) {
        this.roomId = room.id;
        this.user = _user;
        this.users = [];
        for (var user of room.users.values()) {
            this.users.push(new UserData(user));
        }
    }
}