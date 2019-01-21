<template>
  <div>
    <div class="container bg-white">
      <div class="d-flex flex-row justify-content-around">
        <!--  <div class="p-2">
          <a href="#" class="card-link" @click="indietro">
            <font-awesome-icon icon="angle-double-left" size="2x"/>
          </a>
        </div>-->
        <div class="p-2">
          <a href="#" class="card-link" @click="toList">
            <font-awesome-icon icon="list" size="2x"/>
          </a>
        </div>
        <!--  <div class="p-2">
          <a href="#" class="card-link" @click="avanti">
            <font-awesome-icon icon="angle-double-right" size="2x"/>
          </a>
        </div>-->
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
        <draggable
          v-model="selectedItem.data"
          :options="{group:'people'}"
          @start="drag=true"
          @end="drag=false"
        >
          <!-- <transition-group name="list-fretboard" tag="div"> -->
          <div
            class="list-fretboard border-dotted"
            v-for="(i, index) in selectedItem.data"
            :key="i.id"
          >
            <!-- FRETBOARD -->
            <fretboard-chart :input="i" :key="i.key" v-on:tastiera="registerFretboard($event,i)"></fretboard-chart>
            <div class="posizione-icone">
              <a href="#" class="card-link" @click="editItem(i.id)" v-if="!i.merge">
                <font-awesome-icon icon="edit"/>
              </a>
              <a href="#" class="card-link" @click="mergeWithOther(i)" v-if="!i.merge">
                <!-- index>0 &&  -->
                <font-awesome-icon icon="code-branch"/>
              </a>
              <a href="#" class="card-link float-right" @click="deleteItem(i.id)">
                <font-awesome-icon icon="trash"/>
              </a>
            </div>
          </div>
          <!-- </transition-group> -->
        </draggable>
      </div>
    </div>

    <!-- MODALE -->
    <b-modal ref="myModalRef" :title="calcolaTitolo" size="lg" @ok="onSubmit">
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
import { mergeScale, mergeDegree, createScale, createAllDegree, SCALES } from '../assets/js/music-engine.js';
import draggable from 'vuedraggable';

export default {
  name: 'Item',
  components: { 'fretboard-chart': Fretboard, draggable },
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
      editMode: false,
      mergeMode: false,
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
        { text: 'Locrian Penta', value: 'locrian-pentatonic' },
        // Minore melodica
        { text: 'Melodic Minor', value: 'melodic-minor' },
        { text: 'Dorian b2', value: 'dorian-b2' },
        { text: 'Lydian 5#', value: 'lydian-aug' },
        { text: 'Lydian Dominante (4#)', value: 'lydian-dominant' },
        { text: 'Mixolydian b6', value: 'mixolydian-b6' },
        { text: 'Aeolian b5', value: 'aeolian-b5' },
        { text: 'Super Locrian (ALTERED)', value: 'super-locrian' },
        // Minore Armonica
        { text: 'Harmonic Minor', value: 'harmonic-minor' },
        { text: 'Locrian #6', value: 'locrian-#6' },
        { text: 'Ionian #5', value: 'ionian-#5' },
        { text: 'Dorian #4', value: 'dorian-#4' },
        { text: 'Phrygian Dominant', value: 'phrygian-dominant' },
        { text: 'Lydian #2', value: 'lydian-#2' },
        { text: 'Super Locrian (Dim)', value: 'super-locrian-dim' },
        // Toni interi
        { text: 'Whole Tone', value: 'whole-tone' },
        // Diminuita
        { text: 'Diminished st', value: 'diminished-st' },
        { text: 'Diminished ts', value: 'diminished-ts' }
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
    addItem() {
      this.resetForm();
      this.$refs.myModalRef.show();
    },
    editItem(itemId) {
      this.$refs.myModalRef.show();
      let theOne = this.selectedItem.data.find(e => e.id == itemId);
      this.form.scaleUsArp = theOne.type;
      this.form.noteUsDegree = theOne.typeOutput;
      this.form.selectedTuning = theOne.tuning;
      this.form.selectedNote = theOne.root;
      this.form.selectedScale = theOne.name;
      this.form.selectedArp = theOne.name;
      this.editMode = true;
      this.editedItem = theOne.id;
    },
    mergeWithOther(toBeMerged) {
      this.$refs.myModalRef.show();
      this.mergeMode = true;
      this.mergeFirstItem = toBeMerged;
    },
    deleteItem(itemId) {
      this.selectedItem.data = this.selectedItem.data.filter(e => e.id != itemId);
      this.$ls.set('lista', this.items);
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
        // si edita
        let name = this.form.scaleUsArp == 'scala' ? this.form.selectedScale : this.form.selectedArp;
        if (this.editMode) {
          var newItem = {
            id: this.editedItem,
            key: Math.random() * 1000000,
            type: this.form.scaleUsArp,
            typeOutput: this.form.noteUsDegree,
            tuning: this.form.selectedTuning,
            root: this.form.selectedNote,
            name: name
          };
          this.selectedItem.data[this.editedItem] = Object.assign({}, newItem);
          this.$ls.set('lista', this.items);
          this.editMode = false;
          // si mergia
        } else if (this.mergeMode) {
          let secondroot = this.form.selectedNote;
          let secondtype = name;
          let secondintervalli = SCALES[secondtype];
          let mergeSecondItem = createScale(secondroot, secondintervalli);
          const noteMergiate = mergeScale(this.mergeFirstItem.notes.split(' '), mergeSecondItem.notes);
          const gradiMergiati = mergeDegree(noteMergiate, this.mergeFirstItem.gradi.split(' '), mergeSecondItem.gradi);
          console.log('Mergiato: ', noteMergiate, gradiMergiati);
          this.selectedItem.data.push({
            id: this.selectedItem.data.length,
            key: Math.random() * 1000000,
            type: this.form.scaleUsArp,
            typeOutput: this.form.noteUsDegree,
            tuning: this.form.selectedTuning,
            root: this.form.selectedNote,
            name: `${secondroot} ${secondtype} mergiato con ${this.mergeFirstItem.root} ${this.mergeFirstItem.name}`,
            merge: true,
            note: noteMergiate,
            gradi: gradiMergiati
          });
          this.items[this.itemId] = Object.assign({}, this.selectedItem); // per la reattività si  deve mettere uno nuovo
          this.$ls.set('lista', this.items);
          this.mergeMode = false;
          // si salva una nuova scala
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
    },
    registerFretboard(data, who) {
      this.$set(this.selectedItem.data[who.id], 'notes', data.notes);
      this.$set(this.selectedItem.data[who.id], 'gradi', data.gradi);
      console.log('Registering data: ', this.selectedItem.data[who.id]);
    }
  },
  computed: {
    calcolaTitolo() {
      if (this.editMode) {
        return 'Edita';
      } else if (this.mergeMode) {
        return 'Mergia';
      } else {
        return 'Salva';
      }
    }
  }
};
</script>

<style scoped>
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
.list-fretboard {
  transition: all 0.5s;
}
.list-fretboard-enter, .list-fretboard-leave-to
/* .list-fretboard-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px); /* scale(0.9); */
}
.list-fretboard-enter-to {
  opacity: 1;
  transform: translateY(10px); /* scale(1); */
}

.list-fretboard-leave-active {
  /*position: absolute;*/
}

.list-fretboard-move {
  opacity: 1;
  transition: all 0.5s;
}
</style>
