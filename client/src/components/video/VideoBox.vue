<template>
  <section class="section is-paddingless">
    <div class="box is-paddingless">
      <div class="card"></div>

      <div class="columns is-desktop small-videos">
        <SmallVideoBox
          class="small-video-box"
          v-for="(vid, index) in videos"
          v-bind:video="vid.video"
          :key="`video-${index}`"
        ></SmallVideoBox>
      </div>
    </div>
    <div class="management-buttons">
      <b-button v-on:click="buttonClicked" type="is-light" rounded icon-right="microphone"></b-button>
      <b-button v-on:click="buttonClicked" type="is-light" rounded icon-right="video"></b-button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SmallVideoBox from "./SmallVideoBox.vue";
import { KokosClient, KokosEvents } from "ptl-client/src/kokosClient";
import { ParticipantJoined } from "ptl-client/src/participantJoined";
import { UserLeftResponse } from "ptl-client/src/messages/userLeftResponse";
import { WebRtcPeer } from "kurento-utils";
@Component({
  components: {
    SmallVideoBox
  },
  props: ["videos"]
})
export default class VideoBox extends Vue {
  //
  rtcPeer: WebRtcPeer;
  kokosClient: KokosClient;
  created() {
    this.$props.videos = [];

    this.kokosClient = this.$store.state.kokos;
    this.kokosClient.addEventListener(
      KokosEvents.USER_JOINED,
      (data: ParticipantJoined) => {
        //attach the video dom to the view
        console.log(data);
        let videoDOM = data.participant.video;
        let userid = data.participant.userData.id;
        this.rtcPeer = data.participant.rtcPeer;
        let username = data.participant.userData.name;
        this.$props.videos.push({ id: userid, video: videoDOM });
      }
    );
    this.kokosClient.addEventListener(
      KokosEvents.USER_LEFT,
      (data: UserLeftResponse) => {
        //remove the user video and label from the view
        let userid = data.user;
        for (var vid in this.$props.videos) {
          if (this.$props.videos[vid].id == userid) {
            this.$props.videos.splice(vid);
            break;
          }
        }
      }
    );
  }

  buttonClicked() {
    this.kokosClient
  }
}
</script>

<style scoped>
.section {
  height: 100%;
}

.section .box {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.small-videos {
  position: absolute;
  bottom: 20px;
  left: 10px;
}

.card {
  display: flex;
  height: 100%;
  background: #ccc;
  position: relative;
}

@media only screen and (max-width: 1023px) {
  .small-videos {
    position: absolute;
    top: 20px;
    right: 20px;
    left: auto;
  }
}
</style>
