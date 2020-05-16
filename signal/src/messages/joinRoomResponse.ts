import { UserData } from "../userData";
import { Room } from "../room";

export class JoinRoomResponse {
    public roomId: string;
    public users: Array<UserData>;

    constructor(room: Room) {
        this.roomId = room.id;
        this.users = [];
        for (var user of room.users.values()) {
            this.users.push(new UserData(user));
        }
    }
}