<template>
  <div class="container is-fluid is-marginless wrapper">
    <NavBar id="navbar" class="navbarContainer"></NavBar>
    <div id="content">
      <router-view/>
    </div>
    <Footer id="footer" class="is-paddingless footerContainer"></Footer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import NavBar from "./components/layout/NavBar.vue"
  import Footer from "@/components/layout/Footer.vue"

  @Component({
    components: {
      NavBar,
      Footer
    }
  })
  export default class App extends Vue {
    //
  }
</script>

<style scoped>
  #content {
    height: 80vh;
  }
  body {
    height: 100vh;
  }
  .wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .navbarContainer {
    height: 10vh;
    flex-grow: 0;
  }
  .footerContainer {
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>