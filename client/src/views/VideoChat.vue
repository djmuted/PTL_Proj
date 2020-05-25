<template>
  <div class="container is-fluid contentWrapper">
    <div class="columns is-gapeless-mobile contentWrapper is-desktop">
      <div class="column is-two-thirds-desktop videobox">
        <VideoBox></VideoBox>
      </div>
      <div class="column is-one-third-desktop">
        <ChatBox></ChatBox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VideoBox from "@/components/video/VideoBox.vue";
import ChatBox from "@/components/chat/ChatBox.vue";
import NickPrompt from "@/components/utils/NickPrompt.vue";
import { KokosClient, KokosEvents } from "ptl-client/src/kokosClient";
import v from "validator";

@Component({
  components: {
    VideoBox,
    ChatBox
  }
})
export default class VideoChat extends Vue {
  private kokos: KokosClient;
  created() {
    let nickPrompt = new NickPrompt();

    // this.$store.state.kokos = new KokosClient(window.location.origin); //window.location.origin
    this.$store.state.kokos = new KokosClient("http://localhost:5000");
    this.kokos = this.$store.state.kokos;

    nickPrompt.prompt((value: string) => {
      this.kokos.ChangeNick(value);
    });
    this.onCreated();
  }
  private async onCreated() {
    if (v.isUUID(window.location.hash.substr(1), 4)) {
      try {
        let response = await this.kokos.JoinRoom(
          window.location.hash.substr(1)
        );
        this.$store.state.myid = response.user.id;
        this.$buefy.toast.open(`Joined room id: ${response.roomId}`);
      } catch (ex) {
        this.$buefy.toast.open(
          `There was an error while joining a room: ${ex.error}`
        );
      }
    } else {
      let response = await this.kokos.CreateRoom();
      this.$store.state.myid = response.owner.id;
      this.$buefy.toast.open(
        `Created a new room, invite your friends using an invite link!`
      );
      window.location.hash = "#" + response.id;
    }
  }
}
</script>

<style>
.contentWrapper {
  height: 100%;
}

@media only screen and (max-width: 1023px) {
  .videobox {
    height: 60%;
  }
}
</style>