<template>
  <div class="row" :id="tastiera.id">
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
      </h6>
      <p>{{tastiera.info}}</p>
    </div>
    <div class="col-md-6">
      <table class="table table-sm">
        <thead class="thead-light">
          <tr>
            <th v-for="g in tastiera.gradiSplitted">{{g}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="(n,i) in tastiera.notesSplitted"
              :class="{'table-danger':comparison[i]}"
            >{{n|capitalize}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Fretboard, Tunings, createScaleToBePlayed } from '../assets/js/music-engine.js';
import { ac, guitar } from '../App.vue';
export default {
  name: 'fretboard-chart',
  props: ['input', 'all'],
  data: function(params) {
    return {
      tastiera: {},
      width: 0,
      notesOfFirst: []
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.inizialize(this.width);

    console.log();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    inizialize(width) {
      const nuovaTastiera = Fretboard({
        tuning: Tunings[this.input.tuning] || Tunings.E_std,
        callback: this.playNote,
        fretWidth: width < 600 ? 34 : 46
      });
      nuovaTastiera.info = this.input.info;

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
      this.tastiera = nuovaTastiera;
      // si trasmette al padre i dati della scala
      let objCopy = JSON.parse(JSON.stringify(nuovaTastiera));
      this.$emit('tastiera', Object.assign({}, objCopy));
      // console.log('Tastiera: ', this.tastiera);
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
      // console.log('Suonata: ', scaleToBePlayed);
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
      if (elem) {
        elem.parentNode.removeChild(elem);
        this.inizialize(a);
      }
    },
    all: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        let index = newValue.findIndex(e => e.id == this.input.id);
        if (newValue && newValue.length > 0) {
          // update compare array
          this.notesOfFirst = newValue[0].notes.split(' ');
          // console.log('notesOfFirst: ', this.notesOfFirst, index);
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
