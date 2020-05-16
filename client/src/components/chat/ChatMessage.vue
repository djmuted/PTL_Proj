<template>
    <div>
      <p>
        <strong>John Smith</strong> <small>31m</small>
        <br>
        Lorem ipsum dolor sit amet
      </p>
      <hr>
    </div>
</template>
<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class ChatMessage extends Vue {
        //
    }
</script>