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

        //to remove later
        this.video = document.createElement('video');
        this.video.id = 'video-' + this.userData.id;
        this.video.autoplay = true;
        this.video.controls = false;
        document.getElementById('videos').appendChild(this.video);
    }
    public receiveVideo(socket: SocketIOClient.Socket) {
        var constraints = {
            audio: true,
            video: {
                mandatory: {
                    maxWidth: 320,
                    maxFrameRate: 15,
                    minFrameRate: 15
                }
            }
        };
        var options = {
            localVideo: this.video,
            mediaConstraints: constraints,
            onicecandidate: (candidate: RTCIceCandidate, _: any) => this.onIceCandidate(candidate, socket)
        }
        this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, (error) => {
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
}