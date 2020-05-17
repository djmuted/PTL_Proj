<template>
    <!-- <div class="container is-marginless is-paddingless"> -->
    <section class="section is-paddingless">
        <div class="box">
            <h1 class="title">Chat</h1>
            <hr>
            <div class="chatbox">
                <div class="chat-items">
                    <ChatMessage></ChatMessage>
                    <ChatMessage></ChatMessage>
                    <ChatMessage></ChatMessage>
                    <ChatMessage></ChatMessage>
                    <ChatMessage></ChatMessage>
                    <ChatMessage></ChatMessage>
                    <ChatMessage></ChatMessage>
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
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import ChatMessage from "../chat/ChatMessage.vue"
    import SendMessage from "../chat/SendMessage.vue"

    @Component({
        components: {
            ChatMessage,
            SendMessage
        }
    })
    export default class HelloWorld extends Vue {
        //
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