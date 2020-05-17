export class ReceiveFeedRequest {
    public sdp: string;
    public target: string;

    constructor(_sdp: string, _target: string) {
        this.sdp = _sdp;
        this.target = _target;
    }
}