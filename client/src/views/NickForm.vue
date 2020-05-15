<template>
    <div class="container is-fluid contentWrapper">
        <div class="columns is-variable is-gapeless contentWrapper is-vcentered">
            <div class="column is-offset-4 is-4">
                <div class="box">
                    <b-field label="Nickname" custom-class="is-large">
                        <b-input placeholder="Your nickname"
                                 size="is-large"
                                 rounded
                                 icon="account">
                        </b-input>
                    </b-field>
                    <div class="has-text-centered">
                        <b-button @click="join()" rounded expanded size="is-large" class="is-primary has-text-right top go-in-button">
                            Join
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import VideoBox from "@/components/video/VideoBox.vue"
    import ChatBox from "@/components/chat/ChatBox.vue"

    @Component({
        components: {
            VideoBox,
            ChatBox
        }
    })
    export default class VideoChat extends Vue {
        join() {
            this.$router.push('call')
        }
    }
</script>
<style>
    .contentWrapper {
        height: 100%;
    }

    .go-in-button {
        margin-top: 2rem;
    }
</style>