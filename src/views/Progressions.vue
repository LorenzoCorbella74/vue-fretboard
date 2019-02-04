<template>
  <div class="container bg-white">
    <div class="row">
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
      <div class="col-sm-6">
        <h2 class="page-header">Chords Progression</h2>
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
              :class="[!editmode[i]?'bg-secondary':'bg-primary']"
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
                  v-if="editmode[i]"
                  class="mr-2"
                />
                <font-awesome-icon
                  icon="edit"
                  @click="editItem(item)"
                  v-if="!editmode[i]"
                  class="mr-2"
                />
                <font-awesome-icon icon="trash" @click="remove(item)" class="mr-2"/>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TONAL
import { Note, Interval, Distance, Scale, Chord } from 'tonal';
import * as Key from 'tonal-key';
import * as Array from 'tonal-array';

export default {
  data() {
    return {
      chords: [],
      selectedChord: 'Maj7',
      notes: [],
      selectedNote: 'C',
      timeSignatures: Array.range(1, 24).map(e => e + '/4'),
      selectedTimeSignature: '4/4',
      list: [],
      selectedItem: null,
      editmode: []
    };
  },
  mounted() {
    this.chords = Chord.names();
    this.notes = Note.names();
    // console.log(this.chords, this.notes, this.timeSignatures);
  },
  methods: {
    resetToDefaults() {
      this.selectedChord = 'Maj7';
      this.selectedNote = 'C';
      this.selectedTimeSignature = '4/4';
      console.log(this.list, this.editmode);
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
      this.editmode.push(false);
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
      this.$set(this.editmode, who, true);
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
      this.$set(this.editmode, who, false);
      this.resetToDefaults();
    }
  },
  computed: {
    isDisabled() {
      return this.editmode.some(e => e == true);
    }
  }
};
</script>

<style>
.badge-pill {
  border-radius: 5px !important;
}
.box {
  width: 100%;
  height: 48px;
  color: white;
  padding: 12px;
}
</style>
