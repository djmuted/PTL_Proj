import * as io from "socket.io-client";
import hark from 'hark';
import { CreateRoomResponse } from "./messages/createRoomResponse";
import { JoinRoomResponse } from "./messages/joinRoomResponse";
import { JoinRoomRequest } from "./messages/joinRoomRequest";
import { ChatMessageRequest } from "./messages/chatMessageRequest";
import { ChatMessageResponse } from "./messages/chatMessageResponse";
import { JoinRoomError } from "./messages/joinRoomError";
import { UserJoinedResponse } from "./messages/userJoinedResponse";
import { UserLeftResponse } from "./messages/userLeftResponse";
import { UserUpdatedResponse } from "./messages/userUpdatedResponse";
import { UserData } from "./userData";
import { Participant } from "./participant";
import { IceCandidateMessage } from "./iceCandidateMessage";
import { ReceiveFeedRequest } from "./messages/receiveFeedRequest";
import { Dispatcher } from "./dispatcher";
import { ParticipantJoined } from "./participantJoined";
import { ChangeNameRequest } from "./messages/changeNameRequest";

export const KokosEvents = {
  CHAT_MESSAGE: "chat_message",
  USER_JOINED: "user_joined",
  USER_LEFT: "user_left",
  USER_UPDATED: "user_updated",
  ROOM_JOINED: "join_room",
  ROOM_CREATED: "create_room",
  USER_START_SPEAKING: "user_start_speaking",
  USER_STOP_SPEAKING: "user_stop_speaking"
};

export class KokosClient extends Dispatcher {
  private wsUrl: string;
  private socket: SocketIOClient.Socket;
  private user: UserData;
  private participants: Map<string, Participant>;

  /**
   * Initialize PTL-Client logic
   * @param _wsUrl PTL-Signal WebSocket server URL
   */
  constructor(_wsUrl: string) {
    super();
    this.wsUrl = _wsUrl;
    this.participants = new Map<string, Participant>();
    this.socket = io.connect(this.wsUrl);
    this.socket.on("connect", () => {
      this.HandleServerEvent();
      console.log("connected: " + this.socket.connected);
    });
  }
  /**
   * Create a new room
   */
  public CreateRoom(): Promise<CreateRoomResponse> {
    return new Promise((resolve, reject) => {
      let handler = (data: CreateRoomResponse) => {
        this.socket.off("create_room", handler);
        resolve(data);
      };
      this.socket.on("create_room", handler);
      this.socket.emit("create_room", {});
    });
  }
  /**
   * Join an existing room
   * @param roomId UUIDv4 room ID to join
   */
  public JoinRoom(roomId: string): Promise<JoinRoomResponse> {
    return new Promise((resolve, reject) => {
      let handler = (data: JoinRoomResponse) => {
        disableHandlers();
        resolve(data);
      };
      let handlerErr = (data: JoinRoomError) => {
        disableHandlers();
        reject(data);
      };
      let disableHandlers = () => {
        this.socket.off("join_room", handler);
        this.socket.off("join_room_error", handlerErr);
      };
      this.socket.on("join_room", handler);
      this.socket.on("join_room_error", handlerErr);
      this.socket.emit("join_room", new JoinRoomRequest(roomId));
    });
  }
  /**
   * Send a message to the room chat
   * @param message Message to emit
   */
  public Chat(message: string) {
    this.socket.emit("chat_message", new ChatMessageRequest(message));
  }
  /**
   * Changes current user nickname
   * @param nick New nickname
   */
  public ChangeNick(nick: string) {
    this.socket.emit("change_name", new ChangeNameRequest(nick));
  }
  public toggleAudio() {
    const participantUser = this.participants.get(this.user.id);
    participantUser.toggleAudio();
  }

  public toggleVideo() {
    const participantUser = this.participants.get(this.user.id);
    participantUser.toggleVideo();
  }
  private isScreenSharing = false;
  public async toggleScreenShare() {
    this.socket.emit("switch_source");
  }

  private HandleServerEvent() {
    this.socket.on("create_room", (data: CreateRoomResponse) => {
      //console.log(`room created, id: ${data.id}`);
      this.participants = new Map<string, Participant>();
      let participant = new Participant(data.owner);
      this.participants.set(data.owner.id, participant);
      participant.sendVideo(this.socket, this.isScreenSharing);
      this.user = data.owner;
      this.dispatchEvent(
        KokosEvents.USER_JOINED,
        new ParticipantJoined(participant)
      );
    });
    this.socket.on("join_room", (data: JoinRoomResponse) => {
      //console.log(`room joined, id: ${data.roomId}`);
      this.participants = new Map<string, Participant>();
      this.user = data.user;
      for (let userData of data.users) {
        let participant = new Participant(userData);
        this.participants.set(userData.id, participant);
        if (participant.userData.id == this.user.id) {
          participant.sendVideo(this.socket, this.isScreenSharing);
        } else {
          this.ReceiveTrackedStream(participant);
        }
        this.dispatchEvent(
          KokosEvents.USER_JOINED,
          new ParticipantJoined(participant)
        );
      }
    });
    this.socket.on("chat_message", (data: ChatMessageResponse) => {
      //console.log(`chat message (sent by ${data.user}): ${data.message}`);
      this.dispatchEvent(KokosEvents.CHAT_MESSAGE, data);
    });
    this.socket.on("user_joined", (data: UserJoinedResponse) => {
      //console.log(`user ${data.user.id} joined.`);
      let participant = new Participant(data.user);
      this.participants.set(data.user.id, participant);
      this.ReceiveTrackedStream(participant);
      this.dispatchEvent(
        KokosEvents.USER_JOINED,
        new ParticipantJoined(participant)
      );
    });
    this.socket.on("user_left", (data: UserLeftResponse) => {
      //console.log(`user ${data.user} left.`);
      this.participants.delete(data.user);
      this.dispatchEvent(KokosEvents.USER_LEFT, data);
    });
    this.socket.on("user_updated", (data: UserUpdatedResponse) => {
      //console.log(`user ${data.user.id} updated its name: ${data.user.name}.`);
      let participant = this.participants.get(data.user.id);
      participant.userData = data.user;
      this.dispatchEvent(KokosEvents.USER_UPDATED, data);
    });
    this.socket.on("ice_candidate", (data: IceCandidateMessage) => {
      //console.log(`ice candidate for user: ${data.target}.`);
      this.participants
        .get(data.target)
        .rtcPeer.addIceCandidate(data.candidate);
    });
    this.socket.on("receive_video_answer", (data: ReceiveFeedRequest) => {
      //console.log(`receive video from user: ${data.target}.`);
      console.log(data);
      this.participants.get(data.target).rtcPeer.processAnswer(data.sdp);
    });
    this.socket.on("switch_source", async (userid: string) => {
      let participant = this.participants.get(userid);
      if (userid == this.user.id) {
        this.isScreenSharing = !this.isScreenSharing;
        participant.sendVideo(this.socket, this.isScreenSharing);
      } else {
        this.ReceiveTrackedStream(participant);
      }
    });
  }
  private ReceiveTrackedStream(participant: Participant) {
    participant.receiveVideo(this.socket);
    this.AssignSpeechEvents(participant);
  }
  private AssignSpeechEvents(participant: Participant) {
    //Enable speech events
    participant.rtcPeer.peerConnection.addEventListener("track", e => {
      let mediastream = (e as any).streams[0];
      participant.speechEvents = hark(mediastream);
      participant.speechEvents.on('speaking', () => {
        this.dispatchEvent(KokosEvents.USER_START_SPEAKING, participant.userData.id);
      });
      participant.speechEvents.on('stopped_speaking', () => {
        this.dispatchEvent(KokosEvents.USER_STOP_SPEAKING, participant.userData.id);
      });
    });
  }
}
