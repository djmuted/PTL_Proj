import * as kurentoUtils from "kurento-utils";
import * as io from "socket.io-client";
import hark from 'hark';
import { UserData } from "./userData";
import { IceCandidateMessage } from "./iceCandidateMessage";
import { ReceiveFeedRequest } from "./messages/receiveFeedRequest";

export class Participant {
  public userData: UserData;
  public rtcPeer: kurentoUtils.WebRtcPeer;
  public video: HTMLVideoElement;
  public speechEvents: hark.Harker;

  constructor(_userData: UserData) {
    this.userData = _userData;

    this.video = document.createElement("video");
    this.video.id = "video-" + this.userData.id;
    this.video.autoplay = true;
    this.video.controls = false;
  }
  public async sendVideo(socket: SocketIOClient.Socket, isScreensharing: boolean) {
    let constraints = {
      audio: true,
      video: {
        mandatory: {
          maxWidth: 320,
          maxFrameRate: 15,
          minFrameRate: 15,
        },
      },
    };
    let options = {
      localVideo: this.video,
      mediaConstraints: constraints,
      onicecandidate: (candidate: RTCIceCandidate, _: any) =>
        this.onIceCandidate(candidate, socket),
      configuration: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
    };
    if (isScreensharing) {
      //Add audio to screensharing
      const gdmOptions = {
        video: {
          cursor: "always"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      }
      let screenMediastream = await (navigator as any).mediaDevices.getDisplayMedia(gdmOptions) as MediaStream;
      (options as any).videoStream = screenMediastream;
    }
    this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
      options,
      (error) => {
        if (error) {
          console.error(error);
          return;
        }
        this.rtcPeer.generateOffer((error: string, offerSdp: string) =>
          this.offerToReceiveVideo(error, offerSdp, socket)
        );
      }
    );
  }
  public receiveVideo(socket: SocketIOClient.Socket) {
    let options = {
      remoteVideo: this.video,
      onicecandidate: (candidate: RTCIceCandidate, _: any) =>
        this.onIceCandidate(candidate, socket),
      configuration: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
    };
    this.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
      options,
      (error) => {
        if (error) {
          console.error(error);
          return;
        }
        this.rtcPeer.generateOffer((error: string, offerSdp: string) =>
          this.offerToReceiveVideo(error, offerSdp, socket)
        );
      }
    );
  }
  public onIceCandidate(
    candidate: RTCIceCandidate,
    socket: SocketIOClient.Socket
  ) {
    socket.emit(
      "on_ice_candidate",
      new IceCandidateMessage(this.userData.id, candidate)
    );
  }
  public offerToReceiveVideo(
    error: string,
    offerSdp: string,
    socket: SocketIOClient.Socket
  ) {
    socket.emit(
      "receive_from",
      new ReceiveFeedRequest(offerSdp, this.userData.id)
    );
  }
  public toggleAudio() {
    const mediaStream = this.rtcPeer.getLocalStream();
    mediaStream.getAudioTracks()[0].enabled = !mediaStream.getAudioTracks()[0]
      .enabled;
  }

  public toggleVideo() {
    const mediaStream = this.rtcPeer.getLocalStream();
    mediaStream.getVideoTracks()[0].enabled = !mediaStream.getVideoTracks()[0]
      .enabled;
  }
}
