import * as bulmaToast from "bulma-toast";
import { KokosClient, KokosEvents } from "ptl-client/src/kokosClient";
import { ParticipantJoined } from "ptl-client/src/participantJoined";
import { UserLeftResponse } from "ptl-client/src/messages/userLeftResponse";
import v from "validator";
import { SmallBox } from "./smallBox";
import { ChatMessageResponse } from "ptl-client/src/messages/chatMessageResponse";
import { UserData } from "ptl-client/src/userData";
import { UserUpdatedResponse } from "ptl-client/src/messages/userUpdatedResponse";

export class KokosFrontend {
    private smallBoxes: Map<string, SmallBox>;
    private myid: string;
    private kokosClient: KokosClient;
    private mainVidId: string;

    private audioIcon = "microphone";
    private videoIcon = "video";
    private screenshareIcon = "cast";

    private userData: Map<string, UserData>;

    constructor() {
        this.userData = new Map<string, UserData>();
        this.smallBoxes = new Map<string, SmallBox>();
        //this.kokosClient = new KokosClient("http://localhost:2137");
        this.kokosClient = new KokosClient(window.location.origin);

        this.initialize();
    }
    private async initialize() {
        await this.initializeInterface();
        await this.onCreated();
    }
    private async initializeInterface() {
        $('#btn-mute').click(() => {
            this.toggleAudio();
        });
        $('#btn-video').click(() => {
            this.toggleVideo();
        });
        $('#btn-cast').click(() => {
            this.toggleScreenSharing();
        });
        $('#copy-link').click(() => {
            this.Clipboard_CopyTo(window.location.toString());
            bulmaToast.toast({ message: `Invite link has been copied to your clipboard!` });
        });
        this.ToggleEnableControls(true);
        $('#chat-input').keypress((e) => {
            if (e.which == 13) {
                let chatText = $('#chat-input').val();
                this.kokosClient.Chat(chatText.toString());
                this.kokosClient.dispatchEvent(
                    KokosEvents.CHAT_MESSAGE,
                    new ChatMessageResponse(this.myid, chatText.toString())
                );
                $('#chat-input').val("");
                return false;
            }
        });
        this.kokosClient.addEventListener(
            KokosEvents.USER_JOINED,
            (data: ParticipantJoined) => {
                //attach the video dom to the view
                console.log(data);
                let videoDOM = data.participant.video;
                let userid = data.participant.userData.id;
                let username = data.participant.userData.name;

                this.userData.set(userid, data.participant.userData);
                this.smallBoxes.set(userid, new SmallBox(userid, username, videoDOM));
            }
        );
        this.kokosClient.addEventListener(
            KokosEvents.USER_LEFT,
            (data: UserLeftResponse) => {
                //remove the user video and label from the view

                let userid = data.user;
                if (this.smallBoxes.has(userid)) {
                    let smallBox = this.smallBoxes.get(userid);
                    smallBox.Destroy();
                    this.userData.delete(userid);
                    this.smallBoxes.delete(userid);
                }
            }
        );
        this.kokosClient.addEventListener(
            KokosEvents.USER_START_SPEAKING,
            (userid: string) => {
                if (userid == this.myid) return;
                if (userid == this.mainVidId) return;

                if (this.mainVidId) {
                    if (this.smallBoxes.has(this.mainVidId)) {
                        let smallBox = this.smallBoxes.get(this.mainVidId);
                        smallBox.RemoveMain();
                        this.mainVidId = "";
                    }
                }
                let smallBox = this.smallBoxes.get(userid);

                this.mainVidId = userid;
                smallBox.SetMain();
                console.log("appended to main vid");
            }
        );
        this.kokosClient.addEventListener(
            KokosEvents.USER_UPDATED,
            (data: UserUpdatedResponse) => {
                let smallBox = this.smallBoxes.get(data.user.id);
                this.userData.set(data.user.id, data.user);
                smallBox.UpdateName(data.user.name);
            }
        );
        this.kokosClient.addEventListener(
            KokosEvents.CHAT_MESSAGE,
            (data: ChatMessageResponse) => {
                //print the message in the chat view component instead
                let date = new Date();
                let chatbox = $('#chat-items');
                let username = this.userData.get(data.user).name;
                let msg_div = $('<div data-v-35ac558c=""><p><strong>' + username + '</strong><small> ' + date.getHours() + ':' + date.getMinutes() + '</small><br>' + data.message + '</p><hr></div>');
                chatbox.append(msg_div);
                setTimeout(() => {
                    let scroller = document.getElementById('chatbox');
                    scroller.scrollTop = scroller.scrollHeight;
                }, 100);
            }
        );
    }

    private async onCreated() {
        if (v.isUUID(window.location.hash.substr(1), 4)) {
            try {
                let response = await this.kokosClient.JoinRoom(
                    window.location.hash.substr(1)
                );
                this.myid = response.user.id;
                bulmaToast.toast({ message: `Joined room id: ${response.roomId}` });
            } catch (ex) {
                bulmaToast.toast({ message: `There was an error while joining a room: ${ex.error}`, type: "is-danger" });
                return;
            }
        } else {
            let response = await this.kokosClient.CreateRoom();
            this.myid = response.owner.id;
            bulmaToast.toast({ message: `Created a new room, invite your friends using an invite link!` });
            window.location.hash = "#" + response.id;
        }
        this.ToggleEnableControls(false);
        let newnick = prompt("Please enter your nickname", "Guest");

        if (newnick) {
            this.kokosClient.ChangeNick(newnick);
        }
    }
    private ToggleEnableControls(disabled: boolean) {
        ($('#copy-link').get()[0] as HTMLButtonElement).disabled = disabled;
        ($('#btn-mute').get()[0] as HTMLButtonElement).disabled = disabled;
        ($('#btn-video').get()[0] as HTMLButtonElement).disabled = disabled;
        ($('#btn-cast').get()[0] as HTMLButtonElement).disabled = disabled;
    }
    private toggleVideo() {
        this.kokosClient.toggleVideo();
        this.toggleVideoIcon();
    }
    private toggleAudio() {
        this.kokosClient.toggleAudio();
        this.toggleAudioIcon();
    }
    private async toggleScreenSharing() {
        try {
            await this.kokosClient.toggleScreenShare();
            this.toggleScreenSharingIcon();
        } catch (err) {
            //user cancelled screensharing dialog, show an error?
        }
    }
    private toggleScreenSharingIcon() {
        $('#btn-cast>span>span>i').removeClass('mdi-' + this.screenshareIcon);
        this.screenshareIcon == "cast"
            ? (this.screenshareIcon = "cast-connected")
            : (this.screenshareIcon = "cast");
        $('#btn-cast>span>span>i').addClass('mdi-' + this.screenshareIcon);
    }
    private toggleVideoIcon() {
        $('#btn-video>span>span>i').removeClass('mdi-' + this.videoIcon);
        this.videoIcon == "video"
            ? (this.videoIcon = "video-off")
            : (this.videoIcon = "video");
        $('#btn-video>span>span>i').addClass('mdi-' + this.videoIcon);
    }
    private toggleAudioIcon() {
        $('#btn-mute>span>span>i').removeClass('mdi-' + this.audioIcon);
        this.audioIcon == "microphone"
            ? (this.audioIcon = "microphone-off")
            : (this.audioIcon = "microphone");
        $('#btn-mute>span>span>i').addClass('mdi-' + this.audioIcon);
    }
    private Clipboard_CopyTo(value: string) {
        var tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }

}