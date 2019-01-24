<template>
  <div id="app" class="wrapper">
    <!-- NAVIGATION -->
    <b-navbar toggleable type="dark" variant="dark">
      <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
      <div class="container">
        <b-navbar-brand tag="h1" class="m-3">
          <font-awesome-icon icon="guitar" class="mr-2"/>Sovrapposizioni
        </b-navbar-brand>
        <b-collapse is-nav id="nav_text_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/list" right>Studi</b-nav-item>
            <!-- <b-nav-item to="/circolo" right>Circolo V</b-nav-item>
            <b-nav-item to="/interscambio" right>Interscambio modale</b-nav-item>-->
            <!-- <b-nav-item to="/about" right>About</b-nav-item> -->
            <b-nav-item-dropdown text right>
              <b-dropdown-item @click="showImportModal">
                <font-awesome-icon icon="file-import" class="mr-2"/>Importa
              </b-dropdown-item>
              <b-dropdown-item href="#" @click="exportFile">
                <font-awesome-icon icon="file-export" class="mr-2"/>Export
              </b-dropdown-item>
              <b-dropdown-item to="/about">
                <font-awesome-icon icon="question-circle" class="mr-2"/>About
              </b-dropdown-item>
              <b-dropdown-item @click="logout">
                <font-awesome-icon icon="question-circle" class="mr-2"/>Logout
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>

    <!-- OVERLAY -->
    <div class="d-flex justify-content-center align-items-center overlay" v-if="isLoading">
      <div class="p-2 text-center text-light">
        <font-awesome-icon icon="spinner" spin size="5x"/>
        <div>Loading guitar sounds...</div>
      </div>
    </div>

    <div class="container margine-da-navbar">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
    <!-- MODALE IMPORT -->
    <b-modal ref="importModal" :title="'Importa'" @ok="importFile">
      <b-form>
        <file-importer @load="text = $event" :accept="'text/json'"></file-importer>

        <b-form-group label="Tipo">
          <b-form-radio-group id="radios2" v-model="fileImport" name="radioSubComponent">
            <b-form-radio value="substitute">Cancella e sostituisci tutto</b-form-radio>
            <b-form-radio value="merge" disabled>Mergia</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import Soundfont from 'soundfont-player';
import firebase from 'firebase';
export let guitar = null;
export let ac = new AudioContext();

export let loggato = false;

import { lista } from './views/List.vue';
import { saveAs } from 'file-saver';
import { currentUser, requiresAuth } from './router';
import FileImporter from './components/FileImporter.vue';

export default {
  name: 'App',
  components: {
    FileImporter
  },
  data() {
    return {
      isLoading: false,
      fileImport: 'substitute',
      importedText: '',
      lista: lista,
      currentUser: currentUser,
      requiresAuth: requiresAuth
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
    },
    showImportModal() {
      this.$refs.importModal.show();
    },
    importFile() {
      this.isLoading = true;
      const importedContent = JSON.parse(this.fileContent);
      importedContent.forEach((e, i) => {
        this.$set(this.lista, i, e);
      });
      this.isLoading = false;
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log('User logged out!');
          // this.requiresAuth = false;
          this.$router.replace('/login');
        });
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
.wrapper {
  background: url('https://unsplash.it/1500/1500/?image=721') center no-repeat;
  /* 
  
  Lista delle img: https://picsum.photos/images 
  1053
  1041
  994 <-
  769
  765,721

  */
  background-size: cover;
  min-height: 100vh;
  color: rgb(55, 55, 55);
}

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
