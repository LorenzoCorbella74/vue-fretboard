<template>
  <div class="about">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <b-card class="mb-3" :title="$t('Config.card_language_title')">
            <b-form-group :label="$t('Config.radio_language')">
              <b-form-radio-group
                id="radios2"
                v-model="config.language"
                name="radioSubComponent"
                @change="selectLanguage"
              >
                <b-form-radio value="it">Italiano</b-form-radio>
                <b-form-radio value="en">English</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </b-card>

          <b-card class="mb-3" :title="$t('Config.card_export_title')">
            <p class="card-text">{{$t('Config.card_export_content')}}</p>
            <button
              type="button"
              class="btn btn-link"
              @click="exportFile"
            >{{$t('Config.card_btn_export')}}</button>
            <button
              type="button"
              class="btn btn-link"
              @click="showImportModal"
            >{{$t('Config.card_btn_import')}}</button>
            <!-- <b-link
              href="#"
              class="card-link btn-secondary"
              @click="exportFile"
            >{{$t('Config.card_btn_export')}}</b-link>-->
            <!-- <b-link
              href="#"
              class="card-link btn-secondary"
              @click="showImportModal"
            >{{$t('Config.card_btn_import')}}</b-link>-->
          </b-card>
        </div>
        <div class="col-md-6">
          <b-card class="mb-3" :title="$t('Config.card_info_title')">
            <p class="card-text">{{$t('Config.card_info_content')}}</p>
          </b-card>
          <b-card class="mb-3" title="VUE FRETBOARD">
            <p class="card-text">{{$t('Config.card_info_btn')}}</p>
            <b-btn
              class="lead card-link"
              variant="danger"
              target="_blank"
              href="https://github.com/LorenzoCorbella74/vue-fretboard"
            >
              <span class="p-2">
                <font-awesome-icon :icon="['fab', 'github' ]"/>
              </span>More Info
            </b-btn>
          </b-card>
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
import { config, isloading, loadingMsg } from '../App.vue';
import { lista } from './List.vue';
import { saveAs } from 'file-saver';
import FileImporter from '../components/FileImporter.vue';

export default {
  components: {
    FileImporter
  },

  data: function() {
    return {
      config: config,
      isLoading: isloading,
      loadingMsg: loadingMsg,
      fileImport: 'substitute',
      importedText: '',
      lista: lista
    };
  },
  methods: {
    selectLanguage($e) {
      console.log('Language seected: ', $e);
      if ($e == 'en') {
        this.config.language = 'en';
        this.$i18n.locale = this.config.language;
      } else {
        this.config.language = 'it';
        this.$i18n.locale = this.config.language;
      }
    },
    showImportModal() {
      this.$refs.importModal.show();
    },
    exportFile() {
      let formato = 'text/json;charset=utf-8,';
      let data = JSON.stringify(lista);
      var blob = new Blob([data], {
        type: formato
      });
      saveAs(blob, `export_${new Date().toISOString()}.json`);
    },
    importFile() {
      this.isLoading = true;
      const importedContent = JSON.parse(this.importedText);
      importedContent.forEach((e, i) => {
        this.$set(this.lista, i, e);
      });
      this.isLoading = false;
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




