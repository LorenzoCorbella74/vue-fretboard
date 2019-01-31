<template>
  <div class="circolo">
    <div class="container bg-white text-center">
      <div class="row">
        <div class="col-lg-12">
          <h1 class="my-4 page-header">{{$t('Circolo.title')}}</h1>

          <table class="table table-borderless table-hover table-sm">
            <thead class="thead-light">
              <tr>
                <th v-for="(d,index) in degrees" :key="index">{{d}}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(scala,i) in roots"
                :key="i"
                @click="selectScale(scala)"
                :class="{'table-primary':selectedOne == i,'table-warning':selectedTwo == i}"
              >
                <td v-for="n in scala.majors">{{n.key + n.accordo|capitalize}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <div class="row">
        <div class="col-md-6" v-for="a in selectedScales">
          <b-card class="my-2" :title="a.key +' '+ a.mode|capitalize">
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
import { createTableOfCircleOfFifth } from '../assets/js/music-engine.js';
export default {
  data() {
    return {
      test: '',
      degrees: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
      roots: [],
      selectedScales: []
    };
  },
  mounted() {
    this.roots = createTableOfCircleOfFifth('c');
    console.log('Circolo delle quinte: ', this.roots);
  },
  methods: {
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
/* .maj7 {
  background-color: #fd7f7f;
}
.m7 {
  background-color: #5abfe8;
} */
</style>
