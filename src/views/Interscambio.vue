<template>
  <div class="interscambio">
    <div class="container bg-white text-center">
      <div class="row">
        <div class="col-lg-12">
          <h1 class="my-4 page-header">{{$t('Interscambio.title')}}</h1>
          <b-form-group id="selectRootGroup" :label="$t('Item.root')" label-for="selectedNote">
            <b-form-select
              id="selectedNote"
              name="selectedNote"
              v-model="selectedNote"
              :options="optionsNotes"
              @change="handleChange"
              class="mb-3"
            />
          </b-form-group>
          <hr>

          <table class="table table-borderless table-hover table-sm">
            <thead class="thead-light">
              <tr>
                <th></th>
                <th v-for="(d,index) in degrees" :key="index">{{d}}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(scala,i) in roots"
                :key="i"
                :class="{'table-primary':selectedOne == i,'table-warning':selectedTwo == i}"
              >
                <th class="text-left">{{scala.mode|capitalize}}</th>
                <td
                  v-for="n in scala.sons"
                  @click="selectScale(scala)"
                >{{n.key + n.accordo|capitalize}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6" v-for="a in selectedScales">
          <b-card class="mb-3" :title="a.mode|capitalize">
            <table class="table table-borderless table-hover table-sm">
              <thead class="thead-light">
                <tr>
                  <th v-for="(grado,index) in a.gradi" :key="index">{{grado}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="(n,a) in a.notes"
                    :class="{'table-danger':differences[a]}"
                  >{{n|capitalize}}</td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tableModalInterchange, createScaleOnDegree } from '../assets/js/music-engine.js';
export default {
  data() {
    return {
      roots: [],
      selectedNote: 'c',
      degrees: ['1', '2', '3', '4', '5', '6', '7'],
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
      selectedScales: []
    };
  },
  mounted() {
    this.handleChange('c');
  },
  methods: {
    handleChange(evt) {
      const roots = tableModalInterchange(evt);
      for (let r = 0; r < roots.length; r++) {
        const superRoot = roots[r];
        superRoot.sons = [];
        for (let i = 1; i <= 7; i++) {
          superRoot.sons.push(createScaleOnDegree(superRoot.notes[0], superRoot.intervalli, i));
        }
      }
      console.log('Modal interchange: ', roots);
      this.roots = roots;
    },
    selectScale(scale) {
      if (this.selectedScales.length < 2 && this.selectedScales.findIndex(x => x.mode == scale.mode) == -1) {
        this.selectedScales.push(scale);
        return;
      } else {
        let index = this.selectedScales.findIndex(x => x.mode == scale.mode);
        this.selectedScales.splice(index, 1);
      }
    }
  },
  computed: {
    differences: function() {
      let output = [];
      if (this.selectedScales.length == 2) {
        this.selectedScales[0].notes.forEach((e, i) => {
          if (this.selectedScales[1].notes[i] != e) {
            output.push(true);
          } else {
            output.push(false);
          }
        });
      } else {
        output = [];
      }
      return output;
    },
    selectedOne: function() {
      let index;
      if (this.selectedScales.length) {
        index = this.roots.findIndex(x => x.mode == this.selectedScales[0].mode);
      }
      return index;
    },
    selectedTwo: function() {
      let index;
      if (this.selectedScales.length > 1) {
        index = this.roots.findIndex(x => x.mode == this.selectedScales[1].mode);
      }
      return index;
    }
  }
};
</script>

<style>
</style>