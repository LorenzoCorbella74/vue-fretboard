<template>
  <div class="row">
    <div class="col-md-4">
      <h5>{{tastiera.name}}</h5>
    </div>
    <div class="col-md-3">
      <table class="table">
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
export default {
  name: 'fretboard-chart',
  filters: {
    capitalize: function(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  props: ['input'], // <fretboard-chart :input="data"><fretboard-chart>  data  sono dati dinamici
  data: function(params) {
    return {
      tastiera: {}
    };
  },
  mounted() {
    // console.log(this.input, Fretboard);

    const nuovaTastiera = Fretboard({
      tuning: Tunings[this.input.tuning] || Tunings.E_std
    });
    // istanzia il contenitore SVG per la tastiera
    nuovaTastiera.makeContainer(this.$el);
    // si genera la diteggiatura
    nuovaTastiera.scale(this.input.root + ' ' + this.input.name, this.input.type, this.input.typeOutput);
    this.tastiera = nuovaTastiera;
    console.log(this.tastiera);
  },
  beforeUpdate: function() {
    console.log('beforeUpdate(): prima di aggiornare il modello');
  },
  updated: function() {
    console.log('updated(): dopo aver aggiornato');
  }
};
</script>

<style scoped>
</style>
