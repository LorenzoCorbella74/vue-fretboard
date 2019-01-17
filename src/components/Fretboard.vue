<template>
  <div class="row">
    <!-- my-5 -->
    <div class="col-md-4">
      <h5>
        {{tastiera.name}}
        <span class="d-inline">
          <a href="#" class="card-link" @click="playScale()">
            <font-awesome-icon icon="play"/>
          </a>
        </span>
      </h5>
    </div>
    <div class="col-md-3">
      <table class="table table-sm">
        <thead class="thead-light">
          <tr>
            <th v-for="g in tastiera.gradi">{{g}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="n in tastiera.notes">{{n|capitalize}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Fretboard, Tunings } from '../assets/js/music-engine.js';
import { ac, guitar } from '../App.vue';
export default {
  name: 'fretboard-chart',
  props: ['input'], // <fretboard-chart :input="data"><fretboard-chart>  data  sono dati dinamici
  data: function(params) {
    return {
      tastiera: {}
    };
  },
  mounted() {
    // console.log(this.input, Fretboard);

    const nuovaTastiera = Fretboard({
      tuning: Tunings[this.input.tuning] || Tunings.E_std,
      callback: this.playNote
    });
    // istanzia il contenitore SVG per la tastiera
    nuovaTastiera.makeContainer(this.$el);
    // si genera la diteggiatura
    nuovaTastiera.scale(this.input.root + ' ' + this.input.name, this.input.type, this.input.typeOutput);
    this.tastiera = nuovaTastiera;
    console.log(this.tastiera);
  },
  methods: {
    /*
    acoustic_grand_piano
    electric_guitar_jazz 
    acoustic_guitar_nylon
    acoustic_guitar_steel
    */
    playScale() {
      let scaleDISC = this.tastiera.notes.split(' ').map(e => e.toUpperCase() + 3);
      let scaleASC = this.tastiera.notes
        .split(' ')
        .map(e => e.toUpperCase() + 3)
        .reverse();
      let scaleToBePlayed = scaleDISC.concat(this.tastiera.notes[0].toUpperCase() + 4, scaleASC);
      // console.log(scaleToBePlayed);
      let time = ac.currentTime + 0.2;
      scaleToBePlayed.forEach(function(note) {
        guitar.play(note, time, 0.2);
        time += 0.2;
      });
    },
    playNote(note) {
      let noteToBePlayed = note.toUpperCase();
      guitar.play(note, ac.currentTime + 0.2, 0.2);
    }
  }
};
</script>

<style scoped>
</style>
