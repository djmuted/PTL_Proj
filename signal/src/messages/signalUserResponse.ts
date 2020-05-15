export class SignalUserResponse {
    public fromUserId: string;
    public sdp: any;

    constructor(_fromUserId: string, _sdp: any) {
        this.fromUserId = _fromUserId;
        this.sdp = _sdp;
    }
}