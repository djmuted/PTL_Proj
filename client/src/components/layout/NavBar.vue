<template>
  <div class="container is-fluid">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }" class="logo">LiveKOKOS</b-navbar-item>
      </template>

      <template slot="end" v-if="isVideoChat">
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button
              rounded
              size="is-medium"
              class="is-primary"
              v-on:click="copyLink"
              :disabled="isDisabled()"
            >Copy invite link</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import v from "validator";

@Component({
  computed: {
    isVideoChat() {
      return this.$route.name == "Video Call";
    }
  }
})
export default class NavBar extends Vue {
  private Clipboard_CopyTo(value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }
  copyLink() {
    this.Clipboard_CopyTo(window.location);
    this.$buefy.toast.open(`Invite link has been copied to your clipboard!`);
  }
  isDisabled() {
    return !v.isUUID(window.location.hash.substr(1), 4);
  }
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