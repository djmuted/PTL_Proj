import { KokosClient, KokosEvents } from "./kokosClient";
import v from 'validator';
import { ChatMessageResponse } from "./messages/chatMessageResponse";
import { ParticipantJoined } from "./participantJoined";
import { UserUpdatedResponse } from "./messages/userUpdatedResponse";
import { UserLeftResponse } from "./messages/userLeftResponse";

var kokos;
async function Initialize() {
    kokos = new KokosClient('http://localhost:5000/');

    kokos.addEventListener(KokosEvents.CHAT_MESSAGE, (data: ChatMessageResponse) => {
        //print the message in the chat view component instead
        console.log(`${data.user} says: ${data.message}`);
    });

    kokos.addEventListener(KokosEvents.USER_JOINED, (data: ParticipantJoined) => {
        //attach the video dom to the view
        let videoDOM = data.participant.video;
        let userid = data.participant.userData.id;
        let username = data.participant.userData.name;
        //...
    });

    kokos.addEventListener(KokosEvents.USER_UPDATED, (data: UserUpdatedResponse) => {
        //update the username label
        let userid = data.user.id;
        let username = data.user.name;
    });

    kokos.addEventListener(KokosEvents.USER_LEFT, (data: UserLeftResponse) => {
        //remove the user video and label from the view
        let userid = data.user;
    });

    if (v.isUUID(window.location.hash.substr(1), 4)) {
        try {
            let response = await kokos.JoinRoom(window.location.hash.substr(1));
            document.getElementById('roominfo').innerHTML = "Dołączono do pokoju " + response.roomId;
        } catch (ex) {
            document.getElementById('roominfo').innerHTML = "Błąd podczas dołączania do pokoju: " + ex.error;
        }
    } else {
        let response = await kokos.CreateRoom();
        document.getElementById('roominfo').innerHTML = `Utworzono pokój, link zapraszający: <input type="text" value="https://avc.panfu.pw/#${response.id}">`;
    }
    //send chat message example
    kokos.Chat("hello world");
}

Initialize();