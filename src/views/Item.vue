<template>
  <div>
    <div class="container bg-light" :class="{'sticky-top navbar-sticky':fixNavigationBar}">
      <div class="d-flex flex-row justify-content-between text-center mb-2">
        <div class="col-sm-4">
          <a href="#" class="card-link" @click="indietro">
            <font-awesome-icon icon="angle-double-left" size="2x"/>
          </a>
        </div>
        <div class="col-sm-4">
          <a href="#" class="card-link" @click="toList">
            <font-awesome-icon icon="list" size="2x"/>
          </a>
        </div>
        <div class="col-sm-4">
          <a href="#" class="card-link" @click="avanti">
            <font-awesome-icon icon="angle-double-right" size="2x"/>
          </a>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-between">
        <div class="p-1 flex-grow-1">
          <h5>
            <span class="d-inline">
            {{selectedItem.title}}
              <button type="button" class="btn btn-link" @click="toggleDescription">
                <font-awesome-icon :icon="descriptionVisible?'caret-down':'caret-up'"/>
              </button>
            </span>
          </h5>
        </div>
        <div class="p-1">
          <!-- v-if="selectedItem && selectedItem.data && selectedItem.data.length>1" -->
          <b-form-select
            style="width:80px"
            name="selectIntervalsTranspose"
            v-model="intervalTranspose"
            :options="optionsIntervals"
            class="mb-3 mr-2"
          />
        </div>
        <div class="p-1">
          <!-- v-if="selectedItem && selectedItem.data && selectedItem.data.length>1" -->
          <b-button size="m" variant="outline-warning" @click="transpose" class="px-5">
            <font-awesome-icon icon="arrows-alt-h" class="ml-1"/>
          </b-button>
        </div>
        <div class="p-1">
          <b-button size="m" variant="outline-warning" @click="addItem" class="px-5">
            <font-awesome-icon icon="plus"/>
          </b-button>
        </div>
      </div>
      <div class="d-flex flex-row" v-if="descriptionVisible">
        <p class="text-muted">{{selectedItem.description}}</p>
      </div>
    </div>
    <div class="container bg-white">
      <div class="d-flex flex-column">
        <!-- <draggable
          v-model="selectedItem.data"
          :options="{group:'people'}"
          @start="drag=true"
          @end="drag=false"
          :move="checkMove"
        >-->
        <transition-group name="list-fretboard" tag="div">
          <div v-for="i in selectedItem.data" :key="i.id">
            <!-- FRETBOARD -->
            <fretboard-chart
              :input="i"
              :all="selectedItem.data"
              :key="i.key"
              v-on:tastiera="registerFretboard($event,i)"
            ></fretboard-chart>
            <div class="posizione-icone">
              <button
                type="button"
                class="btn btn-link"
                v-b-tooltip.hover
                :title="$t('Item.btn_edit')"
                @click="editItem(i.id)"
                v-if="!i.merge"
              >
                <font-awesome-icon icon="edit"/>
              </button>
              <button
                type="button"
                class="btn btn-link"
                v-b-tooltip.hover
                :title="$t('Item.btn_merge')"
                @click="mergeWithOther(i)"
                v-if="!i.merge"
              >
                <font-awesome-icon icon="code-branch"/>
              </button>
              <button
                type="button"
                class="btn btn-link float-right"
                v-b-tooltip.hover
                :title="$t('Item.btn_delete')"
                @click="deleteItem(i.id)"
              >
                <font-awesome-icon icon="trash"/>
              </button>
            </div>
          </div>
        </transition-group>
        <!--  </draggable> -->
      </div>
    </div>
    <!-- MODALE -->
    <b-modal size="lg" ref="myModalRef" :title="calcolaTitolo" @hidden="handleCancel">
      <form>
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
            <b-form-group
              id="selectTuningGroup"
              :label="$t('Item.tuning')"
              label-for="selectedTuning"
            >
              <b-form-select
                id="selectedTuning"
                v-model="form.selectedTuning"
                :options="optionsTuning"
                class="mb-3"
              />
            </b-form-group>
          </div>
          <div class="col-md-3">
            <b-form-group id="selectRootGroup" :label="$t('Item.root')" label-for="selectedNote">
              <b-form-select
                id="selectedNote"
                name="selectedNote"
                v-model="form.selectedNote"
                :options="optionsNotes"
                class="mb-3"
                v-validate="'required'"
                :class="{'is-invalid': submitted && errors.has('selectedNote') }"
              />
              <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group
              id="selectScaletGroup1"
              :label="$t('Item.radio_label_scale')"
              label-for="selectedScale"
              v-if="form.scaleUsArp=='scala'"
            >
              <b-form-select
                id="selectedScale"
                name="selectedScale"
                v-if="form.scaleUsArp=='scala'"
                v-model="form.selectedScale"
                :options="optionsScales"
                class="mb-3"
                v-validate="'required'"
                :class="{'is-invalid': submitted && errors.has('selectedScale') }"
              />
              <b-form-invalid-feedback v-if="form.scaleUsArp=='scala'">Il campo è richiesto</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="selectArpGroup1"
              :label="$t('Item.radio_label_arpeggio')"
              label-for="selectedArp"
              v-if="form.scaleUsArp=='arpeggio'"
            >
              <b-form-select
                id="selectedArp"
                name="selectedArp"
                v-if="form.scaleUsArp=='arpeggio'"
                v-model="form.selectedArp"
                :options="optionsArp"
                class="mb-3"
                v-validate="'required'"
                :class="{'is-invalid': submitted && errors.has('selectedArp') }"
              />
              <b-form-invalid-feedback v-if="form.scaleUsArp=='arpeggio'">Il campo è richiesto</b-form-invalid-feedback>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <b-form-group id="exampleInputGroup2" label="Note:" label-for="textarea1">
              <b-form-textarea
                id="textarea1"
                v-model="form.info"
                :placeholder="$t('Item.textarea_placeholder')"
                :rows="3"
                :max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </div>
        </div>
      </form>
      <div slot="modal-footer" class="w-100">
        <b-btn size="md" class="float-right" variant="primary" type="submit" @click="onSubmit">Salva</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { lista } from './List.vue';
import Fretboard from '../components/Fretboard.vue';
import { mergeScale, /* mergeDegree, createScale, */ SCALES, UINOTES } from '../assets/js/music-engine.js';
import firebase from '../assets/js/Firebase';
import draggable from 'vuedraggable';
import { Note, Interval, Distance, Scale, Chord } from 'tonal';

export default {
  name: 'Item',
  components: { 'fretboard-chart': Fretboard, draggable },
  data() {
    return {
      name: 'Item selezionato',
      componentKey: 0,
      items: lista, // oggetto condiviso tra le pagine List e Item
      itemId: this.$route.params.id, // FIXME: non si aggiorna !!!!
      selectedItem: {
        title: '',
        desciption: ''
      },
      editMode: false,
      mergeMode: false,
      descriptionVisible: true,
      form: {
        scaleUsArp: 'scala',
        noteUsDegree: 'grado',
        selectedArp: null,
        selectedScale: null,
        info: null,
        selectedNote: null,
        selectedTuning: 'E_std'
      },
      submitted: false,
      intervalTranspose: null,
      optionsIntervals: Scale.intervals('chromatic').map(e => {
        let a = {};
        a.text = e;
        a.value = e;
        return a;
      }),
      optionsScaleUsArp: [
        { text: this.$t('Item.radio_label_scale'), value: 'scala' },
        { text: this.$t('Item.radio_label_arpeggio'), value: 'arpeggio' }
      ],
      optionsNoteUsDegree: [
        { text: this.$t('Item.radio_label_note'), value: 'nota' },
        { text: this.$t('Item.radio_label_degree'), value: 'grado' }
      ],
      optionsScales: SCALES,
      optionsArp: [
        { text: 'Maj', value: 'maj 1P 3M 5P' },
        { text: '7', value: '7 1P 3M 5P 7m' },
        { text: 'min', value: 'min 1P 3m 5P' },
        { text: 'min7', value: 'min7 1P 3m 5P 7m' },
        { text: 'min7/b5', value: 'min7/b5 1P 3m 5d 7m' },
        { text: 'dim', value: 'dim 1P 3m 5d' },
        { text: 'dim7', value: 'dim7 1P 3m 5d 7d' },
        { text: 'aug', value: 'aug 1P 3M 5A' }
      ],
      optionsNotes: Note.names(),
      optionsTuning: [
        { text: 'E 4Ths', value: 'E_4Ths' },
        { text: 'E standard', value: 'E_std' },
        { text: 'Drop D', value: 'Drop_D' },
        { text: 'G open', value: 'G_open' }
      ],
      ref: firebase.firestore().collection('studies'),
      fixNavigationBar: false
    };
  },
  mounted() {
    // console.log(this.$router, this.$route);
    // console.log(this.items);
    let theIndex = this.items.findIndex(x => x.id == this.itemId);
    this.selectedItem = this.items[theIndex];
    console.log('Selected item: ', this.selectedItem);
    console.log('ItemId: ', this.itemId);
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  // per reagire ai cambiamenti dei parametri dell'url...
  beforeRouteUpdate(to, from, next) {
    // console.log(to, from);
    let theIndex = this.items.findIndex(x => x.id == to.params.id);
    this.selectedItem = this.items[theIndex];
    this.forceRerender();
    next();
  },
  methods: {
    toggleDescription() {
      this.descriptionVisible = !this.descriptionVisible;
    },
    transpose() {
      console.log(this.selectedItem.data);
      if (this.intervalTranspose) {
        this.selectedItem.data.forEach(element => {
          element = Object.assign(element, {
            root: Distance.transpose(element.root, this.intervalTranspose).toLowerCase(),
            key: Math.random() * 1000000
          });
        });
      }
      this.ref
        .doc(this.selectedItem.id)
        .update(this.selectedItem)
        .then(docRef => {
          // aggiorna il modello FE
          this.items[this.selectedItem.id] = Object.assign({}, this.selectedItem);
          /*          setTimeout(() => {
            let e = document.querySelector('#mia' + this.selectedItem.data[theIndex].refId);
            e.scrollIntoView({ behavior: 'smooth' });
          }, 0); */
        })
        .catch(error => {
          alert('Error transposing scale in study: ', error);
        });
    },
    checkMove: function(evt) {
      this.ref
        .doc(this.selectedItem.id)
        .update(this.selectedItem)
        .then(docRef => {
          console.log('Scale succesfully moved...');
        })
        .catch(error => {
          alert('Error moving scale in study: ', error);
        });
    },
    handleScroll(event) {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        this.fixNavigationBar = true;
      } else {
        this.fixNavigationBar = false;
      }
    },
    handleCancel() {
      this.editMode = false;
      this.mergeMode = false;
      this.resetForm();
    },
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
      this.form.info = theOne.info;
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
      this.ref
        .doc(this.selectedItem.id)
        .update(this.selectedItem)
        .then(docRef => {
          console.log('Scale succesfully deleted...');
        })
        .catch(error => {
          alert('Error deleting scale in study: ', error);
        });
    },
    avanti() {
      let theIndex = this.items.findIndex(x => x.id == this.$route.params.id);
      let newIndex = theIndex + 1 == this.items.length - 1 ? this.items.length - 1 : theIndex + 1;
      if (newIndex <= this.items.length - 1) {
        this.$router.push(`/item/${this.items[newIndex].id}`);
      }
    },
    indietro() {
      let theIndex = this.items.findIndex(x => x.id == this.$route.params.id);
      let newIndex = theIndex - 1 == 0 ? 0 : theIndex - 1;
      if (newIndex >= 0) {
        this.$router.push(`/item/${this.items[newIndex].id}`);
      }
    },
    toList() {
      this.$router.push('/list'); //this.$router.go(-1);
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (
          valid ||
          (this.errors.has('selectedScale') && this.form.scaleUsArp == 'arpeggio') ||
          (this.errors.has('selectedArp') && this.form.scaleUsArp == 'scala')
        ) {
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
              info: this.form.info,
              name: name
            };
            let theIndex = this.selectedItem.data.findIndex(x => x.id == this.editedItem);
            this.selectedItem.data[theIndex] = Object.assign({}, newItem);
            this.ref
              .doc(this.itemId)
              .update(this.selectedItem)
              .then(docRef => {
                // aggiorna il modello FE
                this.items[this.itemId] = Object.assign({}, this.selectedItem);
                this.mergeMode = false;
                this.submitted = false;
                setTimeout(() => {
                  let e = document.querySelector('#mia' + this.selectedItem.data[theIndex].refId);
                  e.scrollIntoView({ behavior: 'smooth' });
                }, 0);
              })
              .catch(error => {
                alert('Error editing scale in study: ', error);
                this.mergeMode = false;
                this.submitted = false;
              });
            // si mergia
          } else if (this.mergeMode) {
            let secondroot = this.form.selectedNote;
            let input = name.split(' ');
            if (this.form.scaleUsArp == 'arpeggio') {
              var secondNotes;
              input.splice(0, 1);
              secondNotes = input.map(e => Distance.transpose(this.form.selectedNote, e));
              console.log('secondNotes: ', secondNotes);
            } else {
              secondNotes = Scale.notes(secondroot, name);
            }
            const noteMergiate = mergeScale(this.mergeFirstItem.notes, secondNotes);
            const intervalliMergiati = noteMergiate.map(e => e.value).map((e, i, a) => Distance.interval(a[0], e));
            // TODO: si deve mettere la root e la scala della prima per poi poter fare il transpose...
            this.selectedItem.data.push({
              id: this.selectedItem.data.length,
              key: Math.random() * 1000000,
              type: this.form.scaleUsArp,
              typeOutput: this.form.noteUsDegree,
              tuning: this.form.selectedTuning,
              root: this.form.selectedNote,
              secondName: name,
              name: `${secondroot} ${name.split(' ')[0]} merged with ${this.mergeFirstItem.root} ${
                this.mergeFirstItem.name
              }`,
              merge: true,
              noteMergiate: noteMergiate,
              intervals: intervalliMergiati
            });
            let theIndex = this.selectedItem.data.length - 1;
            this.ref
              .doc(this.itemId)
              .update(this.selectedItem)
              .then(docRef => {
                // aggiorna il modello FE
                this.items[this.itemId] = Object.assign({}, this.selectedItem);
                this.mergeMode = false;
                this.submitted = false;
                setTimeout(() => {
                  let e = document.querySelector('#mia' + this.selectedItem.data[theIndex].refId);
                  e.scrollIntoView({ behavior: 'smooth' });
                }, 0);
              })
              .catch(error => {
                alert('Error saving scale in study: ', error);
                this.submitted = false;
              });
            // si salva una nuova scala
          } else {
            this.selectedItem.data.push({
              id: this.selectedItem.data.length,
              key: Math.random() * 1000000,
              type: this.form.scaleUsArp,
              info: this.form.info,
              typeOutput: this.form.noteUsDegree,
              tuning: this.form.selectedTuning,
              root: this.form.selectedNote,
              name: this.form.scaleUsArp == 'scala' ? this.form.selectedScale : this.form.selectedArp
            });
            let theIndex = this.selectedItem.data.length - 1;
            this.ref
              .doc(this.itemId)
              .update(this.selectedItem)
              .then(docRef => {
                // aggiorna il modello FE
                this.items[this.itemId] = Object.assign({}, this.selectedItem);
                this.submitted = false;
                // SOURCE: https://css-tricks.com/snippets/jquery/smooth-scrolling/
                setTimeout(() => {
                  let e = document.querySelector('#mia' + this.selectedItem.data[theIndex].refId);
                  e.scrollIntoView({ behavior: 'smooth' });
                }, 0);
              })
              .catch(error => {
                alert('Error saving scale in study: ', error);
                this.submitted = false;
              });
          }
          // Indipendentemente da tutto si chiude la modale...
          this.$refs.myModalRef.hide();
          this.resetForm();
        }
      });
    },
    resetForm() {
      this.form.scaleUsArp = 'scala';
      this.form.noteUsDegree = 'grado';
      this.form.selectedTuning = 'E_std';
      this.form.selectedNote = null;
      this.form.info = null;
      this.form.selectedScale = null;
      this.form.selectedArp = null;
      this.submitted = false;
    },
    registerFretboard(data, who) {
      this.$set(this.selectedItem.data[who.id], 'notes', data.notes);
      this.$set(this.selectedItem.data[who.id], 'gradi', data.gradi);
      this.$set(this.selectedItem.data[who.id], 'refId', data.id);
      // console.log('Registering data: ', this.selectedItem.data[who.id]);
    }
  },
  computed: {
    calcolaTitolo() {
      if (this.editMode) {
        return this.$t('Item.title_edit');
      } else if (this.mergeMode) {
        return this.$t('Item.title_merge');
      } else {
        return this.$t('Item.title_save');
      }
    }
  }
};
</script>

<style scoped>
.navbar-sticky {
  top: 60px;
  z-index: 500;
  width: inherit;
  height: inherit;
  border-bottom: 1px grey solid;
}
/* @import './styles/app.scss'; */
.posizione-icone {
  margin: 6px auto;
}
@media (max-width: 992px) {
  .posizione-icone {
    margin: 6px auto;
  }
}
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
  position: absolute;
}

.list-fretboard-move {
  opacity: 1;
  transition: all 0.5s;
}
</style>
