<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class NickPrompt extends Vue {
        public prompt() : void {
            this.$buefy.dialog.prompt({
                message: `Podaj swój nick:`,
                inputAttrs: {
                    placeholder: 'Guest',
                    maxlength: 15
                },
                trapFocus: true,
                size: "is-large",
                onConfirm: (value) => this.$buefy.toast.open(`Twój nick to: ${value}`)
            })
        }
    }
</script>