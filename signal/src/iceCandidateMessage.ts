export class IceCandidateMessage {
    public target: string;
    public candidate: string;

    constructor(_target: string, _candidate: string) {
        this.target = _target;
        this.candidate = _candidate;
    }
}