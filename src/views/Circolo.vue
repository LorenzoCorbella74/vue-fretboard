<template>
  <div class="circolo">
    <div class="container bg-white text-center">
      <div class="row">
        <div class="col-lg-12">
          <h1 class="my-4 page-header">{{$t('Circolo.title')}}</h1>
          <b-form-group id="selectRootGroup" :label="$t('Item.root')" label-for="selectedKey">
            <b-form-select
              id="selectedKey"
              name="selectedKey"
              v-model="selectedKey"
              :options="optionsKey"
              @change="handleChange"
              class="mb-3"
            />
          </b-form-group>
          <hr>
          <table class="table table-borderless table-hover table-sm" v-if="roots.length>0">
            <thead class="thead-light">
              <tr>
                <th></th>
                <th v-for="(d,index) in roots[0].degrees" :key="index">{{d}}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(scala,i) in roots"
                :key="i"
                @click="selectScale(scala)"
                :class="{'table-primary':selectedOne == i,'table-warning':selectedTwo == i}"
              >
                <th>{{scala.key}}</th>
                <td v-for="n in scala.chords">{{n}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <div class="row">
        <div class="col-md-6" v-for="a in selectedScales">
          <b-card class="my-2" :title="a.name">
            <table class="table table-borderless table-hover table-sm">
              <thead class="thead-light">
                <tr>
                  <th v-for="(grado,index) in a.degrees" :key="index">{{grado}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="(n,aindex) in a.notes"
                    :class="{'table-danger':differences[aindex]}"
                  >{{n}}</td>
                </tr>
              </tbody>
            </table>
            <!-- <div>
              Altered: <span v-for="alt in a.altered ">{{alt}}</span>
            </div>-->
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { createTableOfCircleOfFifth } from '../assets/js/music-engine.js';
import { Distance } from 'tonal';
import { Scale } from 'tonal';
import * as Key from 'tonal-key';
import { scale } from 'tonal-dictionary';

export default {
  data() {
    return {
      test: '',
      selectedKey: 'major',
      optionsKey: [
        { text: 'Major', value: 'major' },
        { text: 'Dorian', value: 'dorian' },
        { text: 'Phrygian', value: 'phrygian' },
        { text: 'Lydian', value: 'lydian' },
        { text: 'Mixolydian', value: 'mixolydian' },
        { text: 'Aeolian', value: 'aeolian' },
        { text: 'Locrian', value: 'locrian' }
      ],
      roots: [],
      selectedScales: []
    };
  },
  mounted() {
    this.handleChange('major');
  },
  methods: {
    handleChange(mode) {
      this.selectedScales.length = 0;
      let keys = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(Distance.trFifths('C'));
      this.roots = keys.map(e => {
        return {
          key: e,
          name: `${e} ${mode}`,
          notes: Scale.notes(`${e} ${mode}`),
          chords: Key.chords(`${e} ${mode}`),
          degrees: Key.degrees(`${e} ${mode}`),
          intervals: scale(mode),
          altered: Key.alteredNotes(`${e} ${mode}`)
        };
      });

      console.log('Circolo delle quinte: ', this.roots);
    },
    selectScale(scale) {
      if (this.selectedScales.length < 2 && this.selectedScales.findIndex(x => x.key == scale.key) == -1) {
        this.selectedScales.push(scale);
        return;
      } else {
        let index = this.selectedScales.findIndex(x => x.key == scale.key);
        this.selectedScales.splice(index, 1);
      }
    }
  },
  computed: {
    differences: function() {
      let output = [];
      if (this.selectedScales.length == 2) {
        let one = this.selectedScales[0].notes.sort(); // FIXME: escono poi le scale ordinate.....
        let two = this.selectedScales[1].notes.sort();
        one.forEach((e, i) => {
          if (two[i] != e) {
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
        index = this.roots.findIndex(x => x.key == this.selectedScales[0].key);
      }
      return index;
    },
    selectedTwo: function() {
      let index;
      if (this.selectedScales.length > 1) {
        index = this.roots.findIndex(x => x.key == this.selectedScales[1].key);
      }
      return index;
    }
  }
};
</script>

<style>
</style>
