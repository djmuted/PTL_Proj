<template>
  <!-- <div class="container is-marginless is-paddingless"> -->
  <section class="section is-paddingless">
    <div class="box">
      <h1 class="title">Chat</h1>
      <hr />
      <div class="chatbox" ref="scroller">
        <div class="chat-items">
          <ChatMessage
            v-for="msg in messages"
            v-bind:author="msg.author"
            v-bind:contents="msg.contents"
            v-bind:date="msg.date"
            :key="msg.date.getTime()"
          ></ChatMessage>
        </div>
      </div>
      <section class="send-message">
        <SendMessage></SendMessage>
      </section>
    </div>
  </section>
  <!-- </div> -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ChatMessage from "../chat/ChatMessage.vue";
import SendMessage from "../chat/SendMessage.vue";
import { KokosClient, KokosEvents } from "ptl-client/src/kokosClient";
import { ChatMessageResponse } from "ptl-client/src/messages/chatMessageResponse";

@Component({
  components: {
    ChatMessage,
    SendMessage
  },
  props: ["messages"]
})
export default class HelloWorld extends Vue {
  created() {
    let kokos: KokosClient = this.$store.state.kokos;
    kokos.addEventListener(
      KokosEvents.CHAT_MESSAGE,
      (data: ChatMessageResponse) => {
        //print the message in the chat view component instead
        this.$props.messages.push({
          author: data.user,
          contents: data.message,
          date: new Date()
        });
        setTimeout(() => {
          let scroller = this.$refs.scroller as HTMLElement;
          scroller.scrollTop = scroller.scrollHeight;
        }, 100);
      }
    );
    this.$props.messages = [];
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

.chatbox {
  /*display: flex;*/
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: stretch;
  align-items: flex-start;
  height: 100%;
  overflow-y: auto;
}

.chat-items {
  order: 0;
  flex: 5 0 auto;
  align-self: stretch;
  max-height: 100%;
}

.send-message {
  order: 0;
  flex: 1 0 auto;
  align-self: stretch;
  margin-top: 10px;
}
</style>