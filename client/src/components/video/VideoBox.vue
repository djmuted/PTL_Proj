<template>
    <section class="section is-paddingless">
        <div class="box is-paddingless">
            <div class="card">

            </div>

            <div class="columns small-videos">
                <SmallVideoBox></SmallVideoBox>
                <SmallVideoBox></SmallVideoBox>
                <SmallVideoBox></SmallVideoBox>
            </div>
        </div>
    </section>
</template>

<script>
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import SmallVideoBox from "@/components/video/SmallVideoBox"

    @Component({
        components: {
            SmallVideoBox
        }
    })
    export default class VideoBox extends Vue {
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

    .small-videos {
        position: absolute;
        bottom: 20px;
        left: 10px;
    }

    .card {
        display: flex;
        height: 100%;
        background: #ccc;
    }
</style>