<template>
  <div class="progressions">
    <div class="container bg-light mb-1" :class="{'sticky-top navbar-sticky':fixBtnBar}">
      <div class="d-flex flex-row justify-content-between">
        <div class="p-2 page-header">
          <h1>{{$t('Progressions.title')}}</h1>
        </div>
        <div class="p-2">
          <b-button size="m" variant="outline-warning" @click="addProgression" class="px-5">
            <font-awesome-icon icon="plus"/>
          </b-button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row" v-if="progressions.length>0">
        <div
          class="col-lg-3 col-sm-6 my-2"
          v-for="card in progressions"
          :key="card.id"
          :id="'studio'+card.id"
        >
          <div class="card bg-light mb-3">
            <h5 class="card-header">
              {{card.title}}
              <span class="text-muted title-custom">{{card.date | date_format}}</span>
            </h5>
            <div class="card-body" style="padding: 10px 16px 2px 16px;">
              <!-- <h6 class="card-text"></h6> -->
              <p class="card-text custom-height">{{card.description | text_truncate(56)}}</p>
              <div class="d-flex justify-content-around">
                <div>
                  <button
                    type="button"
                    class="btn btn-link"
                    v-b-tooltip.hover
                    :title="$t('Progressions.btn_edit')"
                    @click="editProgression(card.id)"
                  >
                    <font-awesome-icon icon="edit"/>
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-link"
                    v-b-tooltip.hover
                    :title="$t('Progressions.btn_trash')"
                    @click="deleteProgression(card.id)"
                  >
                    <font-awesome-icon icon="trash"/>
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-link"
                    v-b-tooltip.hover
                    title="Play"
                    @click="play(card)"
                  >
                    <font-awesome-icon icon="play"/>
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-link"
                    v-b-tooltip.hover
                    title="Stop"
                    @click="stop(card)"
                  >
                    <font-awesome-icon icon="stop"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALE-->
    <b-modal
      ref="progressionsModal"
      size="lg"
      :title="editmode? $t('Progressions.modal_edit_title'):$t('Progressions.modal_save_title')"
    >
      <div class="row">
        <!-- FORM -->
        <div class="col-sm-6">
          <h2 class="page-header invisible">Chords Progression</h2>
          <b-form-group
            id="exampleInputGroup1"
            :label="$t('Progressions.form_label_title')"
            label-for="formTitle"
          >
            <b-form-input
              id="formTitle"
              type="text"
              name="titolo"
              v-model="form.title"
              :placeholder="$t('Progressions.form_placeholder_title')"
              v-validate="'required'"
              :class="{'is-invalid': submitted && errors.has('titolo') }"
            ></b-form-input>
            <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="exampleInputGroup2"
            :label="$t('Progressions.form_label_description')"
            label-for="exampleInput2"
          >
            <b-form-textarea
              id="exampleInput2"
              type="text"
              name="description"
              v-model="form.description"
              :placeholder="$t('Progressions.form_placeholder_description')"
              :rows="3"
              :max-rows="6"
              v-validate="'required'"
              :class="{'is-invalid': submitted && errors.has('description') }"
            ></b-form-textarea>
            <b-form-invalid-feedback>Il campo è richiesto</b-form-invalid-feedback>
          </b-form-group>
          <div class="d-flex flex-row justify-content-between">
            <div class="p-2">
              <p class="text-muted">Build your progression:</p>
            </div>
            <div class="p-2">
              <b-button size="m" variant="outline-warning" @click="add" class="px-5">
                <font-awesome-icon icon="plus" :disabled="isDisabled"/>
              </b-button>
            </div>
          </div>
          <div class="row">
            <ul
              :class="[Number(item.timeSignature.charAt(0))>4? 'col-sm-12':'col-sm-6']"
              v-for="(item,i) in list"
            >
              <li
                class="list-group-item"
                :class="[!editableList[i]?'bg-secondary':'bg-primary']"
                role="alert"
              >
                <span>
                  <strong class="mr-2">{{ item.timeSignature }}</strong>
                  {{item.root+item.chord}}
                </span>
                <span style="position:absolute; right:0">
                  <font-awesome-icon
                    icon="save"
                    @click="saveItem(item)"
                    v-if="editableList[i]"
                    class="mr-2"
                  />
                  <font-awesome-icon
                    icon="edit"
                    @click="editItem(item)"
                    v-if="!editableList[i]"
                    class="mr-2"
                  />
                  <font-awesome-icon icon="trash" @click="remove(item)" class="mr-2"/>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- DATA -->
        <div class="col-sm-6">
          <h2 class="page-header invisible">Data:</h2>
          <div class="row">
            <div class="col-sm-12">
              <h5>Notes:</h5>
              <span
                class="badge badge-pill mr-1 mb-1"
                v-for="(n,ind0) in notes"
                :class="[selectedNote==n?'badge-primary': 'badge-secondary ']"
                @click="selectNote(n)"
              >{{n}}</span>
              <br>
              <h5>Chords:</h5>
              <span
                class="badge badge-pill mr-1 mb-1"
                v-for="(c,ind1) in chords"
                :class="[selectedChord==c?'badge-primary': 'badge-secondary ']"
                @click="selectChord(c)"
              >{{c}}</span>
              <br>
              <h5>Time Signatures:</h5>
              <span
                class="badge badge-pill mr-1 mb-1"
                v-for="(t,ind2) in timeSignatures"
                :class="[selectedTimeSignature==t?'badge-primary': 'badge-secondary ']"
                @click="selectTimeSignature(t)"
              >{{t}}</span>
              <br>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="w-100">
        <b-btn
          size="md"
          class="float-right"
          variant="primary"
          type="submit"
          @click="onSubmit"
        >{{$t('Progressions.btn_save')}}</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
// TONAL
import { Note, Interval, Distance, Scale, Chord } from 'tonal';
import * as Key from 'tonal-key';
import * as Array from 'tonal-array';

import { currentUser } from '../router';
import VeeValidate, { Validator } from 'vee-validate';
import firebase from '../assets/js/Firebase';

var unsubscribe;

export const progressions = []; /* oggetto condiviso tra le pagine */

export default {
  data() {
    return {
      chords: [],
      selectedChord: 'Maj7',
      notes: [],
      selectedNote: 'C',
      timeSignatures: Array.range(1, 24).map(e => e + '/4'),
      selectedTimeSignature: '4/4',
      progressions: progressions,
      ref: firebase.firestore().collection('progressions'),
      currentUser: currentUser,
      editmode: false,
      submitted: false,
      selectedItem: null,
      list: [],
      form: {
        title: '',
        description: ''
      },
      editableList: [],
      fixBtnBar: false
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);

    this.chords = Chord.names();
    this.notes = Note.names();
    // console.log(this.chords, this.notes, this.timeSignatures);
    this.ref
      .where('userId', '==', this.currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let i = this.progressions.findIndex(x => x.id == doc.id && doc.data().userId === this.currentUser.uid);

          // Se non trova elementi con lo stesso id e dello stesso autore l'aggiunge
          if (i == -1 && doc.data().userId === this.currentUser.uid) {
            this.progressions.push({
              id: doc.id,
              userId: doc.data().userId,
              title: doc.data().title,
              description: doc.data().description,
              data: doc.data().data,
              date: doc.data().date
            });
          }
        });
        unsubscribe = this.ref.onSnapshot(snapshot => {
          /* snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const Item = { ...change.doc.data(), id: change.doc.id };
              console.log('Item was added: ', Item);
            }
            if (change.type === 'modified') {
              const updatedNote = this.progressions.find(item => item.id === change.doc.id);
              console.log('item was updated: ', updatedNote);
            }
            if (change.type === 'removed') {
              const deletedNote = this.progressions.find(item => item.id === change.doc.id);
              console.log('Item was removed: ', deletedNote);
            }
          }); */
        });
      });
  },
  destroyed() {
    unsubscribe();
    window.removeEventListener('scroll', this.handleScroll);
  },
  mounted() {},
  methods: {
    handleScroll() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        this.fixBtnBar = true;
      } else {
        this.fixBtnBar = false;
      }
    },
    addProgression() {
      this.resetForm();
      this.$refs.progressionsModal.show();
    },
    editProgression(itemId) {
      this.$refs.progressionsModal.show();
      let theOne = this.progressions.find(e => e.id == itemId);
      this.form.title = theOne.title;
      this.form.description = theOne.description;
      if (theOne.data.length > 0) {
        theOne.data.forEach((e, i) => {
          this.$set(this.list, i, e);
        });
      }
      // this.list = theOne.data;
      this.form.date = theOne.date;
      this.editmode = true;
      this.editedItem = theOne;
    },
    deleteProgression(itemId) {
      let i = this.progressions.findIndex(x => x.id == itemId);
      this.ref
        .doc(itemId)
        .delete()
        .then(() => {
          this.progressions.splice(i, 1);
        })
        .catch(error => {
          alert('Error removing document: ', error);
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          if (this.editmode) {
            var newItem = {
              id: this.editedItem.id,
              userId: this.currentUser.uid,
              title: this.form.title,
              description: this.form.description,
              data: this.list || [],
              date: this.editedItem.date || new Date().toISOString()
            };
            console.log('Updated Item: ', newItem);
            this.ref
              .doc(this.editedItem.id)
              .update(newItem)
              .then(docRef => {
                // aggiorna il modello FE
                let theIndex = this.progressions.findIndex(x => x.id == this.editedItem.id);
                this.$set(this.progressions, theIndex, newItem);
                let who = this.progressions[theIndex].id;
                // https://mbj36.xyz/set-timeout-vs-next-tick/
                setTimeout(() => {
                  let e = document.querySelector(`#studio${who}`);
                  if (e) e.scrollIntoView({ behavior: 'smooth' });
                }, 0);
              })
              .catch(error => {
                alert('Error editing study: ', error);
              });
            this.editmode = false;
            this.submitted = false;
          } else {
            let nextIndex = this.progressions.length; // si simula un id di partenza
            var newItem = {
              imageNum: nextIndex,
              title: this.form.title,
              userId: this.currentUser.uid,
              description: this.form.description,
              date: new Date().toISOString(),
              data: this.list
            };
            this.ref
              .add(newItem)
              .then(docRef => {
                this.submitted = false;
                newItem.id = docRef.id;
                this.$set(this.progressions, nextIndex, newItem);
                let who = this.progressions[nextIndex].id;
                // https://mbj36.xyz/set-timeout-vs-next-tick/
                setTimeout(() => {
                  let e = document.querySelector(`#studio${who}`);
                  if (e) e.scrollIntoView({ behavior: 'smooth' });
                }, 0);
              })
              .catch(error => {
                alert('Error adding study: ', error);
              });
          }
          // si chiude la modale
          this.$refs.progressionsModal.hide();
          this.resetForm();
        }
      });
    },
    resetForm() {
      this.form.title = '';
      this.form.description = '';
      this.list.length = 0;
      this.submitted = false;
    },
    play(progression) {
      console.log(progression);
    },
    stop(progression) {
      console.log(progression);
    },

    /* -------------------------------------- MODALE -------------------------------------- */
    resetToDefaults() {
      this.selectedChord = 'Maj7';
      this.selectedNote = 'C';
      this.selectedTimeSignature = '4/4';
      // console.log(this.list, this.editableList);
    },
    selectNote(note) {
      this.selectedNote = note;
    },
    selectChord(chord) {
      this.selectedChord = chord;
    },
    selectTimeSignature(time) {
      this.selectedTimeSignature = time;
    },
    selectItem(itm) {
      this.selectedItem = item;
    },
    add() {
      this.list.push({
        root: this.selectedNote,
        chord: this.selectedChord,
        timeSignature: this.selectedTimeSignature
      });
      this.editableList.push(false);
      this.resetToDefaults();
    },
    remove(item) {
      let who = this.list.findIndex(e => e == item);
      this.list.splice(who, 1);
      this.resetToDefaults();
    },
    editItem(item) {
      let who = this.list.findIndex(
        e => e.root == item.root && e.chord == item.chord && e.timeSignature == item.timeSignature
      );
      console.log(who);
      this.$set(this.editableList, who, true);
      this.selectedChord = item.chord;
      this.selectedNote = item.root;
      this.selectedTimeSignature = item.timeSignature;
    },
    saveItem(item) {
      let who = this.list.findIndex(
        e => e.root == item.root && e.chord == item.chord && e.timeSignature == item.timeSignature
      );
      console.log(who);
      this.$set(this.list, who, {
        root: this.selectedNote,
        chord: this.selectedChord,
        timeSignature: this.selectedTimeSignature
      });
      this.$set(this.editableList, who, false);
      this.resetToDefaults();
    }
  },
  computed: {
    isDisabled() {
      return this.editableList.some(e => e == true);
    }
  }
};
</script>

<style>
.badge-pill {
  border-radius: 5px !important;
}
.title-custom {
  font-size: 10px;
  position: absolute;
  top: 18px;
  right: 12px;
}
</style>
