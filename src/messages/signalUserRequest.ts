export class SignalUserRequest {
    public userId: string;
    public sdp: any;

    constructor(_userId: string, _sdp: any) {
        this.userId = _userId;
        this.sdp = _sdp;
    }
}