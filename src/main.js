import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router';
import store from './store';
import Storage from 'vue-ls';

// STILI
// import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/lux.min.css';
// import './assets/styles/lux.min.css';
//import './assets/styles/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/styles/index.scss'

// FONT AWESOME
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faMusic,
  faPlus,
  faPlay,
  faEdit,
  faTrash,
  faList,
  faAngleDown,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faSpinner,
  faGuitar,
  faQuestionCircle,
  faFileImport,
  faFileExport,
  faCodeBranch
} from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
library.add(faMusic, faPlus, faPlay, faEdit, faTrash, faList, faAngleDown, faAngleDoubleLeft, faAngleDoubleRight, faSpinner, faGuitar, faQuestionCircle, faFileImport,
  faFileExport, faCodeBranch)

// GLOBAL FILTERS
import {
  capitalize,
  text_truncate
} from './filters/textFilters';
import {
  date_format
} from './filters/dateFilters';
Vue.filter('capitalize', capitalize);
Vue.filter('text_truncate', text_truncate);
Vue.filter('date_format', date_format);

Vue.component('font-awesome-icon', FontAwesomeIcon)



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
/* Object.defineProperty(Vue.prototype, '$Soundfont', {
  value: Soundfont
}); */