import { Participant } from "./participant";

export class ParticipantJoined {
    public participant: Participant;

    constructor(_participant: Participant) {
        this.participant = _participant;
    }
}