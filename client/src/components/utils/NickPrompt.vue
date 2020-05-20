<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class NickPrompt extends Vue {
  public prompt(callback: (_: string) => void): void {
    this.$buefy.dialog.prompt({
      message: `Podaj swój nick:`,
      inputAttrs: {
        placeholder: "Guest",
        maxlength: 15
      },
      trapFocus: true,
      size: "is-large",
      onConfirm: value => {
        callback(value);
        this.$buefy.toast.open(`Your nickname has been changed to: ${value}`);
      }
    });
  }
}
</script>