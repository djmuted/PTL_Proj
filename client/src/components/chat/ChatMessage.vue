<template>
  <div>
    <p>
      <strong>{{ author }}</strong>
      <small>&nbsp;{{ timeAgo() }}</small>
      <br />
      {{ contents }}
    </p>
    <hr />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TimeAgo from "javascript-time-ago";

// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgoLib = new TimeAgo("en-US");
@Component({
  props: ["author", "contents", "date"]
})
export default class ChatMessage extends Vue {
  timeAgo() {
    //this.$props.date

    return timeAgoLib.format(this.$props.date);
    return 123;
  }
}
</script>