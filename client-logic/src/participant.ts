import * as kurentoUtils from 'kurento-utils';
import * as io from 'socket.io-client';
import { UserData } from './userData';
import { IceCandidateMessage } from './iceCandidateMessage';
import { ReceiveFeedRequest } from './messages/receiveFeedRequest';

export class Participant {
    public userData: UserData;
    public rtcPeer: kurentoUtils.WebRtcPeer;
    public video: HTMLVideoElement;

    constructor(_userData: UserData) {
        this.userData = _userData;

        this.video = document.createElement('video');
        this.video.id = 'video-' + this.userData.id;
        this.video.autoplay = true;
        this.video.controls = false;
    }
    public sendVideo(socket: SocketIOClient.Socket) {
        let constraints = {
            audio: true,
            video: {
                mandatory: {
                    maxWidth: 320,
                    maxFrameRate: 15,
                    minFrameRate: 15
                }
            }
        };
        let options = {
            localVideo: this.video,
            mediaConstraints: constraints,
            onicecandidate: (candidate: RTCIceCandidate, _: any) => this.onIceCandidate(candidate, socket),
            configuration: { iceServers: [{ "urls": "stun:stun.l.google.com:19302" }] }
        }
        this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, (error) => {
            if (error) {
                console.error(error);
                return;
            }
            this.rtcPeer.generateOffer((error: string, offerSdp: string) => this.offerToReceiveVideo(error, offerSdp, socket));
        });
    }
    public receiveVideo(socket: SocketIOClient.Socket) {
        let options = {
            remoteVideo: this.video,
            onicecandidate: (candidate: RTCIceCandidate, _: any) => this.onIceCandidate(candidate, socket),
            configuration: { iceServers: [{ "urls": "stun:stun.l.google.com:19302" }] }
        }
        this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error) => {
            if (error) {
                console.error(error);
                return;
            }
            this.rtcPeer.generateOffer((error: string, offerSdp: string) => this.offerToReceiveVideo(error, offerSdp, socket));
        });
    }
    public onIceCandidate(candidate: RTCIceCandidate, socket: SocketIOClient.Socket) {
        socket.emit("on_ice_candidate", new IceCandidateMessage(this.userData.id, candidate));
    }
    public offerToReceiveVideo(error: string, offerSdp: string, socket: SocketIOClient.Socket) {
        socket.emit("receive_from", new ReceiveFeedRequest(offerSdp, this.userData.id));
    }
    public dispose() {
        document.getElementById('videos').removeChild(this.video);
    }
}