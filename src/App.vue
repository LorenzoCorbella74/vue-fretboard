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
            <!-- <b-nav-item to="/about" right>About</b-nav-item> -->
            <b-nav-item-dropdown text right>
              <b-dropdown-item>
                <font-awesome-icon icon="file-import" class="mr-2"/>
                <file-importer @load="text = $event"></file-importer>
              </b-dropdown-item>
              <b-dropdown-item href="#" @click="exportFile">
                <font-awesome-icon icon="file-export" class="mr-2"/>Export
              </b-dropdown-item>
              <b-dropdown-item to="/about">
                <font-awesome-icon icon="question-circle" class="mr-2"/>About
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <!-- OVERLAY -->
    <div class="d-flex justify-content-center align-items-center overlay" v-if="isLoading">
      <div class="p-2 text-center">
        <font-awesome-icon icon="spinner" spin size="5x"/>

        <div>Loading guitar sounds...</div>
      </div>
    </div>

    <div class="container margine-da-navbar">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
import Soundfont from 'soundfont-player';
export let guitar = null;
export let ac = new AudioContext();

import { lista } from './views/List.vue';
import { saveAs } from 'file-saver';
import FileImporter from './components/FileImporter.vue';

/* function handleFiles(files) {
  // Check for the various File API support.
  if (window.FileReader) {
    // FileReader are supported.
    getAsText(files[0]);
  } else {
    alert('FileReader are not supported in this browser.');
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

function loadHandler(event) {
  var json = event.target.result;
  processData(json);
}

function processData(json) {
  console.log(JSON.parse(json));
}

function errorHandler(evt) {
  if (evt.target.error.name == 'NotReadableError') {
    alert("Canno't read file !");
  }
} */

export default {
  name: 'App',
  components: {
    FileImporter
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    exportFile() {
      let formato = 'text/json;charset=utf-8,';
      let data = JSON.stringify(lista);
      var blob = new Blob([data], {
        type: formato
      });
      saveAs(blob, `export_${new Date().toISOString()}.json`);
    }
  },
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
  margin-top: 16px;
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

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
