import Vue from "vue";
import Router from "vue-router";

// 
import List from "./views/List.vue";
import Item from "./views/Item.vue";
import Circolo from './views/Circolo.vue'
import Interscambio from './views/Interscambio.vue'


Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      name: "list",
      component: List
    },
    {
      path: "/circolo",
      name: "circolo",
      component: Circolo
    },
    {
      path: "/interscambio",
      name: "interscambio",
      component: Interscambio
    },
    {
      path: "/item/:id",
      name: "item",
      component: Item
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});