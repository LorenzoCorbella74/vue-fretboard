// CORE
import Vue from "vue";
import Router from "vue-router";
import firebase from 'firebase'

// COMPONENTI
import List from "./views/List.vue";
import Item from "./views/Item.vue";
import Circolo from './views/Circolo.vue';
import Interscambio from './views/Interscambio.vue';
import NotFound from './views/NotFound.vue';
import SignUp from './views/SignUp.vue';
import Login from './views/Login.vue';

Vue.use(Router);


export let currentUser = null;
export let requiresAuth = null;

let router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/list'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
      /* ,
            beforeRouteLeave(to, from, next) {
              console.log('Login router: ', to, from);
              next();
            } */
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: "/list",
      name: "list",
      /* component: List, */
      component: () => import( /* webpackChunkName: "about" */ "./views/List.vue"),
      meta: {
        requiresAuth: true
      }
      /* ,
            beforeRouteEnter(to, from, next) {
              console.log(to, from);
              next();
            } */
    },
    {
      path: "/circolo",
      name: "circolo",
      component: Circolo,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/interscambio",
      name: "interscambio",
      component: Interscambio,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/item/:id",
      name: "item",
      component: Item,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/about",
      name: "about",
      meta: {
        requiresAuth: true
      },

      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  currentUser = firebase.auth().currentUser;
  requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log('Current user in router: ', currentUser, requiresAuth);

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('list')
  else next()
});

router.onError((err) => console.error(err));

/* router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
}) */

export default router;