<template>
  <div class="row" :id="'mia'+tastiera.id">
    <!-- my-5 -->
    <div class="col-md-5">
      <h6>
        {{tastiera.name}}
        <span class="d-inline">
          <button
            type="button"
            class="btn btn-link"
            v-b-tooltip.hover
            title="Suona"
            @click="playScale()"
          >
            <font-awesome-icon icon="play"/>
          </button>
        </span>
        <span class="d-inline">
          <button type="button" class="btn btn-link" @click="toggleDetail">
            <font-awesome-icon icon="info-circle"/>
          </button>
        </span>
      </h6>
      <p>{{tastiera.info}}</p>
    </div>
    <div class="col-md-6">
      <table class="table table-sm" v-if="detailStep==1">
        <thead class="thead-light">
          <tr>
            <th v-for="g in tastiera.gradiSplitted" class="text-center">{{g}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="t in tastiera.intervals" class="text-center">{{t}}</td>
          </tr>
          <tr>
            <td
              class="text-center"
              v-for="(n,i) in tastiera.readAbleNotes"
              :class="{'table-danger':comparison[i]}"
            >{{n}}</td>
          </tr>
        </tbody>
      </table>

      <table class="table table-sm" v-if="detailStep==2">
        <tbody>
          <tr>
            <th>Degrees</th>
            <td v-for="d in tastiera.degrees" class="text-center">{{d}}</td>
          </tr>
          <tr>
            <th>Chords</th>
            <td v-for="a in tastiera.accordi" class="text-center">{{a}}</td>
          </tr>
          <tr>
            <th>Second. V°</th>
            <td v-for="ds in tastiera.domSecondarie" class="text-center">{{ds}}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="detailStep==3">
        <strong>All chords that fits this scale:</strong>
        <br>
        <span
          v-for="r in tastiera.chordsForThisScale"
          class="badge badge-pill mr-1 mb-1 badge-secondary"
        >{{r}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Fretboard, Tunings, createScaleToBePlayed } from '../assets/js/music-engine.js';
import * as Key from 'tonal-key';
import * as Scale from 'tonal-scale';
import { ac, guitar } from '../App.vue';
export default {
  name: 'fretboard-chart',
  props: ['input', 'all'],
  data: function() {
    return {
      tastiera: {},
      width: 0,
      notesOfFirst: [],
      detailStep: 1
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.inizialize(this.width);
    console.log(this.input);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    toggleDetail() {
      if (this.detailStep == 3) {
        this.detailStep = 1;
      } else {
        this.detailStep++;
      }
    },
    inizialize(width) {
      const nuovaTastiera = Fretboard({
        tuning: Tunings[this.input.tuning] || Tunings.E_std,
        callback: this.playNote,
        fretWidth: width < 600 ? 34 : 46,
        frets: width > 1000 ? 15 : 12
      });
      nuovaTastiera.info = this.input.info;
      nuovaTastiera.keyName = this.input.root + ' ' + this.input.name;
      nuovaTastiera.degrees = Key.degrees(nuovaTastiera.keyName);
      nuovaTastiera.accordi = Key.chords(nuovaTastiera.keyName);
      nuovaTastiera.intervals = Scale.intervals(this.input.name);
      nuovaTastiera.domSecondarie = Key.secDomChords(nuovaTastiera.keyName);
      nuovaTastiera.tonic = Key.props(nuovaTastiera.keyName).tonic;
      nuovaTastiera.relatives = Key.modeNames().map(name => Key.relative(name, nuovaTastiera.keyName));
      nuovaTastiera.paralells = Key.modeNames().map(name => nuovaTastiera.tonic + ' ' + name);
      nuovaTastiera.chordsForThisScale = Scale.chords(this.input.name);

      // istanzia il contenitore SVG per la tastiera
      nuovaTastiera.makeContainer(this.$el);
      // si genera la diteggiatura
      if (!this.input.merge) {
        nuovaTastiera.scale(this.input.root + ' ' + this.input.name, this.input.type, this.input.typeOutput);
      } else {
        nuovaTastiera.mergedScale(
          this.input.note,
          this.input.gradi,
          this.input.type,
          this.input.typeOutput,
          this.input.name
        );
      }
      nuovaTastiera.notesSplitted = nuovaTastiera.notes.split(' ');
      nuovaTastiera.gradiSplitted = nuovaTastiera.gradi.split(' ');
      this.tastiera = Object.assign({}, nuovaTastiera);
      // si trasmette al padre i dati della scala
      let objCopy = JSON.parse(JSON.stringify(nuovaTastiera));
      this.$emit('tastiera', Object.assign({}, objCopy));
      console.log('Tastiera: ', this.tastiera);
    },
    onResize() {
      this.width = this.$el.offsetWidth;
    },
    /*
    acoustic_grand_piano
    electric_guitar_jazz 
    acoustic_guitar_nylon
    acoustic_guitar_steel
    */
    playScale() {
      let original = this.tastiera.notes.split(' ');
      let scaleToBePlayed = createScaleToBePlayed(original);
      console.log('Suonata: ', original, scaleToBePlayed);
      let time = ac.currentTime + 0.25;
      scaleToBePlayed.forEach(function(note) {
        guitar.play(note, time, 0.25);
        time += 0.25;
      });
    },
    playNote(note) {
      let noteToBePlayed = note.toUpperCase();
      guitar.play(note, ac.currentTime + 0.25, 0.25);
    }
  },
  computed: {
    comparison() {
      let output = [];
      if (this.input.id > 0 && this.tastiera && this.notesOfFirst.length > 0) {
        this.tastiera.notesSplitted.forEach((e, i) => {
          let indice = this.notesOfFirst.findIndex(k => k == e);
          if (indice !== -1) {
            output.push(false);
          } else {
            output.push(true);
          }
        });
      } else {
        output = [];
      }
      // console.log('confronto: ', this.tastiera.notesSplitted, output);
      return output;
    }
  },
  watch: {
    width: function(a, b) {
      // console.log('Width: ', a, b);
      const elem = document.querySelector(`#${this.tastiera.id}`);
      if (a != b && elem) {
        elem.parentNode.removeChild(elem);
        this.inizialize(a);
      }
    },
    all: {
      deep: true,
      handler(newValue, oldValue) {
        let index = newValue.findIndex(e => e.id == this.input.id);
        if (newValue && newValue.length > 0) {
          // update compare array
          this.notesOfFirst = newValue[0].notes.split(' ');
          // console.log('notesOfFirst: ', this.notesOfFirst, index);
        }
      }
    },
    input: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if ((oldValue && newValue.key != oldValue.key) || (newValue.key && !oldValue)) {
          const elem = document.querySelector(`#${this.tastiera.id}`);
          if (elem) {
            elem.parentNode.removeChild(elem);
            this.inizialize(this.width);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
