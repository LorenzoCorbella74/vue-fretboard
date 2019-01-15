import Vue from "vue";
import Router from "vue-router";
import List from "./views/List.vue";
import Item from "./views/Item.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      component: List
    },
    {
      path: "/item/:id",
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