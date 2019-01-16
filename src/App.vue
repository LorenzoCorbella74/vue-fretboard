<template>
  <div id="app">
    <!-- NAVIGATION -->
    <div class="container">
      <b-navbar toggleable type="dark" variant="dark">
        <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
        <b-navbar-brand tag="h1" class="m-3">
          <font-awesome-icon icon="music" class="mr-2"/>Sovrapposizioni
        </b-navbar-brand>
        <b-collapse is-nav id="nav_text_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/" right>Studi</b-nav-item>
            <b-nav-item to="/circolo" right>Circolo V</b-nav-item>
            <b-nav-item to="/interscambio" right>Interscambio modale</b-nav-item>
            <b-nav-item to="/about" right>About</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <!-- OVERLAY -->
    <div class="d-flex justify-content-center align-items-center overlay" v-if="isLoading">
      <div class="p-2 text-center">
        <font-awesome-icon icon="spinner" spin size="3x"/>
        <div>Loading...</div>
      </div>
    </div>

    <div class="container margine-da-navbar">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Soundfont from 'soundfont-player';
export let guitar = null;
export let ac = new AudioContext();

export default {
  name: 'App',
  components: {},
  data() {
    return {
      isLoading: false
    };
  },
  methods: {},
  mounted() {
    this.isLoading = true;
    const a = this;
    Soundfont.instrument(ac, 'acoustic_guitar_steel').then(function(guitarDownloaded) {
      guitar = guitarDownloaded;
      console.log('Guitar: ', guitar);
      a.isLoading = false;
    });
  }
};
</script>


<style lang="scss">
.margine-da-navbar {
  margin-top: 24px;
}
.overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 100; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
</style>
