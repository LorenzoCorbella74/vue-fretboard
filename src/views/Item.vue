<template>
  <div>
    <div class="container">
      <div class="d-flex flex-row justify-content-around">
        <div class="p-2">
          <a href="#" class="card-link" @click="indietro">
            <font-awesome-icon icon="angle-double-left" size="2x"/>
          </a>
        </div>
        <div class="p-2">
          <a href="#" class="card-link" @click="toList">
            <font-awesome-icon icon="list" size="2x"/>
          </a>
        </div>
        <div class="p-2">
          <a href="#" class="card-link" @click="avanti">
            <font-awesome-icon icon="angle-double-right" size="2x"/>
          </a>
        </div>
      </div>

      <div class="d-flex flex-row justify-content-between">
        <div class="p-2 page-header">
          <h1>{{selectedItem.title}}</h1>
        </div>
        <div class="p-2">
          <b-button size="m" :variant="'outline-primary'" @click="addItem" class="px-5">
            <font-awesome-icon icon="plus"/>
          </b-button>
        </div>
      </div>

      <div class="d-flex flex-column">
        <div class="border-dotted" v-for="i in selectedItem.data" :key="i.id">
          <!-- FRETBOARD -->
          <fretboard-chart :input="i" :key="i.key"></fretboard-chart>
          <div class="posizione-icone">
            <a href="#" class="card-link" @click="editItem(i.id)">
              <font-awesome-icon icon="edit"/>
            </a>
            <a href="#" class="card-link" @click="deleteItem(i.id)">
              <font-awesome-icon icon="trash"/>
            </a>
          </div>
        </div>
      </div>
    </div>

    <b-modal ref="myModalRef" :title="editmode? 'Edita':'Salva'" @ok="onSubmit">
      <b-form>
        <div class="row">
          <div class="col-md-6">
            <b-form-group>
              <b-form-radio-group
                v-model="form.scaleUsArp"
                :options="optionsScaleUsArp"
                name="scaleUsArp"
              ></b-form-radio-group>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group>
              <b-form-radio-group
                v-model="form.noteUsDegree"
                :options="optionsNoteUsDegree"
                name="noteUsDegree"
              ></b-form-radio-group>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <b-form-select v-model="form.selectedTuning" :options="optionsTuning" class="mb-3"/>
          </div>
          <div class="col-md-3">
            <b-form-select v-model="form.selectedNote" :options="optionsNotes" class="mb-3"/>
          </div>
          <div class="col-md-6">
            <b-form-select
              v-if="form.scaleUsArp=='scala'"
              v-model="form.selectedScale"
              :options="optionsScales"
              class="mb-3"
            />
            <b-form-select
              v-if="form.scaleUsArp=='arpeggio'"
              v-model="form.selectedArp"
              :options="optionsArp"
              class="mb-3"
            />
          </div>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { lista } from './List.vue';
import Fretboard from '../components/Fretboard.vue';

export default {
  name: 'Item',
  components: { 'fretboard-chart': Fretboard },
  data() {
    return {
      name: 'Item selezionato',
      componentKey: 0,
      items: lista, // oggetto condiviso tra le pagine List e Item
      itemId: Number(this.$route.params.id), // FIXME: non si aggiorna !!!!
      selectedItem: {
        title: '',
        desciption: ''
      },
      editmode: false,
      form: {
        scaleUsArp: 'scala',
        noteUsDegree: 'grado',
        selectedArp: null,
        selectedScale: null,
        selectedNote: null,
        selectedTuning: 'E_std'
      },
      optionsScaleUsArp: [{ text: 'Scala', value: 'scala' }, { text: 'Arpeggio', value: 'arpeggio' }],
      optionsNoteUsDegree: [{ text: 'Note', value: 'nota' }, { text: 'Gradi', value: 'grado' }],
      optionsScales: [
        { text: 'Lydian', value: 'lydian' },
        { text: 'Lydian Penta', value: 'lydian-pentatonic' },
        { text: 'Major (Ionian)', value: 'ionian' },
        { text: 'Major Penta', value: 'major-pentatonic' },
        { text: 'Major Blues', value: 'major-blues' },
        { text: 'Mixolydian', value: 'mixolydian' },
        { text: 'Mixolydian Penta', value: 'mixolydian-pentatonic' },
        { text: 'Dorian', value: 'dorian' },
        { text: 'Dorian Penta (Min 6Th)', value: 'dorian-pentatonic' },
        { text: 'Minor 6Th Blues Penta', value: 'minor6Th-blues-pentatonic' },
        { text: 'Minor (Aeolian)', value: 'aeolian' },
        { text: 'Minor Penta', value: 'minor-pentatonic' },
        { text: 'Minor Blues', value: 'minor-blues' },
        { text: 'Phrygian', value: 'phrygian' },
        { text: 'Phrygian Penta', value: 'phrygian-pentatonic' },
        { text: 'Locrian', value: 'locrian' },
        { text: 'Locrian Penta', value: 'locrian-pentatonic' }
        // TODO:
      ],
      optionsArp: [
        { text: 'Maj', value: 'maj' },
        { text: '7', value: '7' },
        { text: 'min', value: 'min' },
        { text: 'min7', value: 'min7' },
        { text: 'min7/b5', value: 'min7/b5' },
        { text: 'dim', value: 'dim' },
        { text: 'dim7', value: 'dim7' },
        { text: 'aug', value: 'aug' }
      ],
      optionsNotes: [
        { text: 'C', value: 'c' },
        { text: 'C#/Db', value: 'c#' },
        { text: 'D', value: 'd' },
        { text: 'D#/Eb', value: 'd#' },
        { text: 'E', value: 'e' },
        { text: 'F', value: 'f' },
        { text: 'F#/Gb', value: 'f#' },
        { text: 'G', value: 'g' },
        { text: 'G#/Ab', value: 'g#' },
        { text: 'A', value: 'a' },
        { text: 'A#/Bb', value: 'a#' },
        { text: 'B', value: 'b' }
      ],
      optionsTuning: [
        { text: 'E 4Ths', value: 'E_4Ths' },
        { text: 'E standard', value: 'E_std' },
        { text: 'Drop D', value: 'Drop_D' },
        { text: 'G open', value: 'G_open' }
      ]
    };
  },
  mounted() {
    // console.log(this.$router, this.$route);
    // console.log('Items: ', this.items, this.itemId);
    this.selectedItem = this.items[this.itemId];
    console.log('Selected item: ', this.selectedItem);
    console.log('ItemId: ', this.itemId);
  },
  // per reagire ai cambiamenti dei parametri dell'url...
  beforeRouteUpdate(to, from, next) {
    console.log(to, from);
    this.selectedItem = this.items[Number(to.params.id)];
    this.forceRerender();
    next();
  },
  methods: {
    forceRerender() {
      this.componentKey++;
    },
    addItem(formData) {
      this.$refs.myModalRef.show();
    },
    editItem(itemId) {
      this.$refs.myModalRef.show();
      let theOne = this.selectedItem.data.find(e => e.id == itemId);
      console.log(theOne);
      this.form.scaleUsArp = theOne.type;
      this.form.noteUsDegree = theOne.typeOutput;
      this.form.selectedTuning = theOne.tuning;
      this.form.selectedNote = theOne.root;
      this.form.selectedScale = theOne.name;
      this.form.selectedArp = theOne.name;
      this.editmode = true;
      this.editedItem = theOne.id;
    },
    deleteItem(itemId) {
      this.selectedItem.data = this.selectedItem.data.filter(e => e.id != itemId);
    },
    avanti() {
      let itemNumber =
        Number(this.$route.params.id) + 1 == this.items.length - 1
          ? this.items.length - 1
          : Number(this.$route.params.id) + 1;
      if (itemNumber <= this.items.length - 1) {
        this.$router.push(`/item/${itemNumber}`);
      }
    },
    indietro() {
      let itemNumber = Number(this.$route.params.id) - 1 == 0 ? 0 : Number(this.$route.params.id) - 1;
      if (itemNumber >= 0) {
        this.$router.push(`/item/${itemNumber}`);
      }
    },
    toList() {
      this.$router.push('/'); //this.$router.go(-1);
    },
    onSubmit(evt) {
      evt.preventDefault();
      if ((this.form.selectedNote && this.form.selectedScale) || (this.form.selectedNote && this.form.selectedArp)) {
        if (this.editmode) {
          var newItem = {
            id: this.editedItem,
            key: Math.random() * 1000000,
            type: this.form.scaleUsArp,
            typeOutput: this.form.noteUsDegree,
            tuning: this.form.selectedTuning,
            root: this.form.selectedNote,
            name: this.form.scaleUsArp == 'scala' ? this.form.selectedScale : this.form.selectedArp
          };
          this.selectedItem.data[this.editedItem] = Object.assign({}, newItem);
          this.$ls.set('lista', this.items);
          this.editmode = false;
        } else {
          this.selectedItem.data.push({
            id: this.selectedItem.data.length,
            key: Math.random() * 1000000,
            type: this.form.scaleUsArp,
            typeOutput: this.form.noteUsDegree,
            tuning: this.form.selectedTuning,
            root: this.form.selectedNote,
            name: this.form.scaleUsArp == 'scala' ? this.form.selectedScale : this.form.selectedArp
          });
          this.items[this.itemId] = Object.assign({}, this.selectedItem); // per la reattività si  deve mettere uno nuovo
          this.$ls.set('lista', this.items);
        }
        // console.log(this.$data.items);
        this.$refs.myModalRef.hide();
        this.resetForm();
      } else {
        evt.preventDefault();
      }
    },
    resetForm() {
      this.form.scaleUsArp = 'scala';
      this.form.noteUsDegree = 'grado';
      this.form.selectedTuning = 'E_std';
      this.form.selectedNote = null;
      this.form.selectedScale = null;
      this.form.selectedArp = null;
    }
  }
};
</script>

<style>
/* @import './styles/app.scss'; */
/* .posizione-icone {
  margin: -15% 0 0 0;
}
@media (max-width: 992px) {
  .posizione-icone {
    margin: -45% 0 0 0;
  }
} */
.border-dotted {
  border: 1px grey dotted;
  padding: 12px;
}
</style>
