<template>
<div class="container is-fluid">
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }" class="logo">
                LiveKOKOS
            </b-navbar-item>
        </template>

         <template slot="end" v-if="isVideoChat">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <b-button rounded size="is-medium" class="is-primary">
                        Skopiuj link do konferencji
                    </b-button>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component({
        computed: {
            isVideoChat() {
                return this.$route.name == 'Video Call';
            }
        }
    })
    export default class NavBar extends Vue {
        //
    }
</script>

<style scoped>
    .logo {
        font-size: 2em;
    }
    .logo img {
        /* width: 48px !important; */
        height: 60px;
        margin-right: 12px;
        max-height: none;
    }
</style>