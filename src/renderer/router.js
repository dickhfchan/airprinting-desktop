import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/home', name: 'home', redirect: {name: 'myPrinter'} },
    { path: '/my-printer', name: 'myPrinter', component: require('./views/MyPrinter.vue').default },
    { path: '/login', name: 'login', component: require('./views/Login.vue').default, meta: {layout: 'empty'} },
    { path: '/edit-printer', name: 'editPrinter', component: require('./views/EditPrinter.vue').default },
    { path: '*', redirect: {name: 'home'} },
  ]
})

export default router
