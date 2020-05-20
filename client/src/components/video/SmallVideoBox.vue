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
  mounted() {
    (this.$refs.vid as any).appendChild(this.$props.video);
  }
}
</script>

<style scoped>
.small-video {
  border: 2px solid #fff;
  background: #ddd;
  height: 100px;
  width: 150px;
}
</style>
          