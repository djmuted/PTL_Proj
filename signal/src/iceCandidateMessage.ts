export class IceCandidateMessage {
    public target: string;
    public candidate: RTCIceCandidate;

    constructor(_target: string, _candidate: RTCIceCandidate) {
        this.target = _target;
        this.candidate = _candidate;
    }
}