<template>
  <div id="app" class="wrapper">
    <!-- NAVIGATION -->
    <b-navbar sticky toggleable type="dark" variant="dark" v-if="currentUser">
      <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
      <div class="container">
        <b-navbar-brand tag="h1" class="m-3" to="/list">
          <font-awesome-icon icon="guitar" class="mr-2"/>
          {{$t("App.appTitle")}}
        </b-navbar-brand>
        <b-collapse is-nav id="nav_text_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item right>
              <span style="font-size:12px">{{currentUser.email}}</span>
            </b-nav-item>
            <!-- <b-nav-item to="/list" right>Studi</b-nav-item> -->
            <!-- <b-nav-item to="/circolo" right>Circolo V</b-nav-item>
            <b-nav-item to="/interscambio" right>Interscambio modale</b-nav-item>-->
            <b-nav-item to="/config" right>
              <font-awesome-icon icon="cog" class="mr-2"/>
            </b-nav-item>
            <b-nav-item right @click="logout">
              {{$t("App.navbarLogout")}}
              <font-awesome-icon icon="sign-out-alt" class="ml-1"/>
            </b-nav-item>
            <!-- <b-nav-item-dropdown text right>
              <b-dropdown-item @click="showImportModal">
                <font-awesome-icon icon="file-import" class="mr-2"/>
                {{$t("App.navbarImport")}}
              </b-dropdown-item>
              <b-dropdown-item href="#" @click="exportFile">
                <font-awesome-icon icon="file-export" class="mr-2"/>
                {{$t("App.navbarExport")}}
              </b-dropdown-item>
              <b-dropdown-item to="/config">
                <font-awesome-icon icon="question-circle" class="mr-2"/>
                {{$t("App.navbarAbout")}}
              </b-dropdown-item>
              <b-dropdown-item @click="logout">
                <font-awesome-icon icon="question-circle" class="mr-2"/>
                {{$t("App.navbarLogout")}}
              </b-dropdown-item>
              <b-dropdown-item @click="changeLanguage">
                <font-awesome-icon icon="question-circle" class="mr-2"/>language
              </b-dropdown-item>-->
            </b-nav-item-dropdown> 
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>

    <!-- SPINNER  + OVERLAY-->
    <global-spinner :isLoading="isLoading" :loadingMsg="loadingMsg"></global-spinner>

    <div class="container" :class="{'margine-da-navbar':!!currentUser}">
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
            <b-form-radio value="substitute">{{$t("App.fileImportSub")}}</b-form-radio>
            <b-form-radio value="merge" disabled>{{$t("App.fileImportMerge")}}</b-form-radio>
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

export let isloading = false; // SPINNER GLOBALE
export let loadingMsg = ''; // SPINNER GLOBALE
export let config = {language:'it'}; // CONFIGURAZIONE GLOBALE

import { lista } from './views/List.vue';
import { saveAs } from 'file-saver';
// import { currentUser, requiresAuth } from './router';
import FileImporter from './components/FileImporter.vue';
import GlobalSpinner from './components/GlobalSpinner.vue';

import { EventBus } from './main.js';

export default {
  name: 'App',
  components: {
    FileImporter,
    GlobalSpinner
  },
  data() {
    return {
      isLoading: isloading,
      loadingMsg: loadingMsg,
      fileImport: 'substitute',
      importedText: '',
      lista: lista,
      currentUser: null,
      ref: firebase
    };
  },
  methods: {
    /*     changeLanguage() {
      if (this.$i18n.locale == 'it') {
        this.$i18n.locale = 'en';
      } else {
        this.$i18n.locale = 'it';
      }
    }, */
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
      this.isLoading = true;
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log('User logged out!');
          this.currentUser = null;
          this.isLoading = false;
          this.lista = this.lista.splice(0, this.lista.length); // rimuove tutto....
          this.$router.replace('/login');
        });
    }
  },
  mounted() {
    this.isLoading = true;
    this.loadingMsg = this.$t('App.default_loading_msg');
    const a = this;
    Soundfont.instrument(ac, 'acoustic_guitar_steel').then(function(guitarDownloaded) {
      guitar = guitarDownloaded;
      console.log('Guitar: ', guitar);
      a.isLoading = false;
    });
  },
  created() {
    // 1) EVENT BUS
    // EventBus.$on('logged-user', user => {
    //   console.log('User: ', user);
    //   this.currentUser = Object.assign({}, user);
    // });
    // 2) LISTENER AUTH
    // si mette i listeners dentro questo hook
    // ma poteva essere recuperato anche dall'user ritornato
    // dalla funzione login
    this.ref.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
  },
  computed: {},
  watch: {
    currentUser: function(newValue, oldValue) {
      console.log('watch in app: ', newValue, oldValue);
    }
  }
};
</script>


<style lang="scss">
.wrapper {
  background: url('https://unsplash.it/1500/1500/?image=721') center no-repeat;
  /* 
  
  Lista img sfondo: https://picsum.photos/images 
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
