<template>
  <div class="column">
    <div class="small-video" ref="vid"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  props: ["video"]
})
export default class SmallVideoBox extends Vue {
  $refs: {
    vid: HTMLVideoElement;
  };

  mounted() {
    (this.$refs.vid as any).appendChild(this.$props.video);
    this.$props.video.style.minHeight = "100%";
    this.$props.video.style.minWidth = "100%";
  }
}
</script>

<style scoped>
.small-video {
  border: 2px solid #fff;
  background: #ddd;
  width: 150px;
  height: 120px;
}
</style>
          