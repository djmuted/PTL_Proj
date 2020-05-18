<template>
  <div class="container is-fluid contentWrapper">
    <div class="columns is-variable is-gapeless contentWrapper">
      <div class="column is-three-quarters">
        <VideoBox></VideoBox>
      </div>
      <div class="column">
        <ChatBox></ChatBox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import VideoBox from "@/components/video/VideoBox.vue";
import ChatBox from "@/components/chat/ChatBox.vue";
import NickPrompt from "@/components/utils/NickPrompt.vue"
import { KokosClient, KokosEvents } from "ptl-client/src/kokosClient";

@Component({
  components: {
    VideoBox, ChatBox
  }
})
export default class VideoChat extends Vue {

  created() {
    let nickPrompt = new NickPrompt()
    nickPrompt.prompt();
  }
}
</script>

<style>
.contentWrapper {
  height: 100%;
}
</style>