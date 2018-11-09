import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/home', name: 'home', component: require('./views/Home.vue').default },
    { path: '/login', name: 'login', component: require('./views/Login.vue').default, meta: {layout: 'empty'} },
    { path: '*', redirect: {name: 'home'} },
  ]
})

export default router
