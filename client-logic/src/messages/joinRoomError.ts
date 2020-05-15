export class JoinRoomError {
    public roomId: string;
    public error: string;

    constructor(_roomId: string, _error: string) {
        this.roomId = _roomId;
        this.error = _error;
    }
}