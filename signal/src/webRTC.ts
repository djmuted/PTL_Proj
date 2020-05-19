import kurento from 'kurento-client';
import register from 'kurento-client';
import { User } from "./user";
import { ReceiveFeedRequest } from "./messages/receiveFeedRequest";
import { Room } from './room';
import { IceCandidateMessage } from './iceCandidateMessage';

export class WebRTC {
    private kurento: kurento.ClientInstance;

    private KURENTO_WS = 'ws://localhost:8890/kurento';

    constructor() {
        if (process.env.KURENTO_WS) {
            this.KURENTO_WS = process.env.KURENTO_WS;
        }
    }
    public async ConfigureWebRTC() {
        this.kurento = await kurento(this.KURENTO_WS);
    }
    public async OnCreateRoom(room: Room) {
        room.pipeline = await this.kurento.create('MediaPipeline');
    }
    public async OnRemoveRoom(room: Room) {
        (room.pipeline as any).release(); //broken typings
    }
    public async OnJoinRoom(user: User, room: Room) {
        user.outgoingMedia = await room.pipeline.create('WebRtcEndpoint');
        user.outgoingMedia.setMaxVideoRecvBandwidth(300);
        user.outgoingMedia.setMinVideoRecvBandwidth(100);

        if (user.iceCandidates.has(user.id)) {
            let iceCandidateQueue = user.iceCandidates.get(user.id);
            while (iceCandidateQueue.length) {
                let message = iceCandidateQueue.shift();
                user.outgoingMedia.addIceCandidate(message.candidate);
            }
        }
        user.outgoingMedia.on('OnIceCandidate', event => {
            let candidate = register.getComplexType("IceCandidate")(event.candidate) as RTCIceCandidate;
            user.socket.emit('ice_candidate', new IceCandidateMessage(user.id, candidate));
        });
    }
    private getEndpointForUser(user: User, target: string) {
        if (user.id == target) {
            return user.outgoingMedia;
        }

    }
    public ConfigureHandlers(user: User) {
        user.socket.on("receive_from", async (data: ReceiveFeedRequest) => {
            if (!user.room) return;
            let targetUser = user.room.users.get(data.target);
            if (targetUser) {
                let endpoint: kurento.WebRtcEndpoint;
                if (user.id == data.target) {
                    endpoint = user.outgoingMedia;
                } else if (!user.incomingMedia.has(targetUser.id)) {
                    endpoint = await user.room.pipeline.create('WebRtcEndpoint');
                    endpoint.setMaxVideoRecvBandwidth(300);
                    endpoint.setMinVideoRecvBandwidth(100);
                    user.incomingMedia.set(targetUser.id, endpoint);

                    if (user.iceCandidates.has(targetUser.id)) {
                        let iceCandidateQueue = user.iceCandidates.get(targetUser.id);
                        while (iceCandidateQueue.length) {
                            let message = iceCandidateQueue.shift();
                            console.log(`user: ${user.id} collect candidate for ${message.target}`);
                            endpoint.addIceCandidate(message.candidate);
                        }
                    }
                    endpoint.on('OnIceCandidate', event => {
                        // console.log(`generate incoming media candidate: ${userSession.id} from ${sender.id}`);
                        let candidate = register.getComplexType("IceCandidate")(event.candidate) as RTCIceCandidate;
                        user.socket.emit('ice_candidate', new IceCandidateMessage(targetUser.id, candidate));
                    });
                    await targetUser.outgoingMedia.connect(endpoint);
                } else {
                    console.log(`user: ${user.id} get existing endpoint to receive video from: ${targetUser.id}`);
                    endpoint = user.incomingMedia.get(targetUser.id);
                    await targetUser.outgoingMedia.connect(endpoint);
                }
                let sdpAnswer = await endpoint.processOffer(data.sdp);
                user.socket.emit("receive_video_answer", new ReceiveFeedRequest(sdpAnswer, data.target));
                await endpoint.gatherCandidates();
            }
        });
        user.socket.on("on_ice_candidate", async (data: IceCandidateMessage) => {
            if (!user.room) return;
            let candidate = register.getComplexType('IceCandidate')(data.candidate) as RTCIceCandidate;
            if (data.target == user.id) {
                if (user.outgoingMedia) {
                    console.log(` add candidate to self : %s`, data.target);
                    user.outgoingMedia.addIceCandidate(candidate);
                } else {
                    console.log(` still does not have outgoing endpoint for ${data.target}`);
                    user.iceCandidates.get(data.target).push(new IceCandidateMessage(data.target, candidate));
                }
            } else {
                if (user.incomingMedia.has(data.target)) {
                    let webRtc = user.incomingMedia.get(data.target);
                    console.log(`%s add candidate to from %s`, user.id, data.target);
                    webRtc.addIceCandidate(candidate);
                } else {
                    console.log(`${user.id} still does not have endpoint for ${data.target}`);
                    if (!user.iceCandidates.has(data.target)) {
                        user.iceCandidates.set(data.target, []);
                    }
                    user.iceCandidates.get(data.target).push(new IceCandidateMessage(data.target, candidate));
                }
            }
        });
    }
}