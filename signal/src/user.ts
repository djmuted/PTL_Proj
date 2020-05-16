import socketIO from "socket.io";
import { WebRtcEndpoint } from "kurento-client";
import { IceCandidateMessage } from "./iceCandidateMessage";
import { Room } from "./room";

export class User {
    public id: string;
    public name: string;
    public socket: socketIO.Socket;
    public room: Room;
    public incomingMedia: Map<string, WebRtcEndpoint>;
    public outgoingMedia: WebRtcEndpoint;
    public iceCandidates: Map<string, Array<IceCandidateMessage>>;

    constructor(_id: string, _socket: socketIO.Socket) {
        this.id = _id;
        this.name = "Guest";
        this.socket = _socket;
        this.incomingMedia = new Map<string, WebRtcEndpoint>();
        this.iceCandidates = new Map<string, Array<IceCandidateMessage>>();
    }
}