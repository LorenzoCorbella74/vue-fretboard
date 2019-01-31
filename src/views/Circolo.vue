<template>
  <div class="circolo">
    <div class="container bg-white text-center">
      <div class="row">
        <div class="col-lg-12">
          <h1 class="my-4 page-header">{{$t('Circolo.title')}}</h1>

          <table class="table table-borderless table-hover">
            <thead class="thead-light">
              <tr>
                <th v-for="(d,index) in degrees" :key="index">{{d}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(scala,i) in roots" :key="i">
                <td v-for="n in scala.majors" :class="[n.accordo]">{{n.key + n.accordo|capitalize}}</td>
              </tr>
            </tbody>
          </table>
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
      roots: []
    };
  },
  mounted() {
    this.roots = createTableOfCircleOfFifth('c');
    console.log('Circolo delle quinte: ', this.roots);
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
