<template>
  <b-field label="Message">
    <b-input
      @keyup.native.enter="onEnter"
      v-model="chatText"
      maxlength="200"
      type="text"
      size="is-large"
      expanded
    ></b-input>
  </b-field>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { KokosClient, KokosEvents } from "ptl-client/src/kokosClient";
import { ChatMessageResponse } from "ptl-client/src/messages/chatMessageResponse";

@Component({})
export default class SendMessage extends Vue {
  private text: string = "";
  created() {}
  onEnter() {
    let kokos: KokosClient = this.$store.state.kokos;
    kokos.Chat(this.chatText.toString());
    kokos.dispatchEvent(
      KokosEvents.CHAT_MESSAGE,
      new ChatMessageResponse(this.$store.state.myid, this.chatText.toString())
    );
    this.chatText = "";
  }
  get chatText() {
    return this.text;
  }
  set chatText(val: string) {
    this.text = val;
  }
}
</script>