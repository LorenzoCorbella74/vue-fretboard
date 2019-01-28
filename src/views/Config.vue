<template>
  <div class="about">
    <div class="container">
      <div class="row bg-white">
        <div class="col-md-6 my-2">
          <h3 class="page-header">{{$t('Config.page_title')}}</h3>
          <!-- <b-jumbotron header="Buon studio!" lead="La webapp che hai sempre sognato...">
            <br>
            <p>
              L'obiettivo è aiutare tutti i chitarristi a visualizzare le sovrapposizioni di scale ed arpeggi sulla tastiera
              e archiviare e gestire comodamente gli studi di tali sovrapposizioni.
            </p>
            <hr class="my-4">
            <p>Per le tecnologie usate vedere:
               <span>
                <font-awesome-icon :icon="['fab', 'vuejs' ]" size="4x"/>
              </span>
            </p>
            <br>
            <b-btn
              class="lead"
              variant="danger"
              href="https://github.com/LorenzoCorbella74/vue-fretboard"
            >
              <span class="p-2">
                <font-awesome-icon :icon="['fab', 'github' ]"/>
              </span>More Info
            </b-btn>
            <br>
          </b-jumbotron>-->
          <b-form-group :label="$t('Config.radio_language')">
            <b-form-radio-group
              id="radios2"
              v-model="config.language"
              name="radioSubComponent"
              @change="selectLanguage"
            >
              <b-form-radio value="it">Italiano</b-form-radio>
              <b-form-radio value="en">English</b-form-radio>
              <b-form-radio value="es" disabled>Spanish</b-form-radio>
              <b-form-radio value="fr" disabled>French</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>
      <footer class="footer">
        <div class="text-center p-3">
          <p>
            Made with
            <span style="color: #e25555;">&#9829;</span> in Rome
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { config } from '../App.vue';
export default {
  // $t('Config.radio_language')
  data: function() {
    return {
      config: config
    };
  },
  methods: {
    selectLanguage($e) {
      console.log('Selezionato: ', $e);
      if ($e == 'en') {
        this.config.language = 'en';
        this.$i18n.locale = this.config.language;
      } else {
        this.config.language = 'it';
        this.$i18n.locale = this.config.language;
      }
    }
  },
  watch: {
    /* selectedLanguage: function(newVal, oldVal) {
      
    } */
  }
};
</script>



<style>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  font-weight: 800;

  color: white;
}
</style>




