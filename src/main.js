import Vue from "vue";
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
// import "bootstrap/dist/css/bootstrap.min.css"
import "./assets/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css"
import router from "./router";
import store from "./store";
import Storage from 'vue-ls';

import Soundfont from 'soundfont-player';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(Storage, {
  namespace: 'vuejs__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

// Si può accedere tramite this.$Soundfont
Object.defineProperty(Vue.prototype, '$Soundfont', {
  value: Soundfont
});