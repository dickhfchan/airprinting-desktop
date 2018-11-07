import * as hp from 'helper-js'
import Vue from 'vue'
import './plugins/vuetify'
import Start from './Start.vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios, {getAxiosInstance} from './plugins/axios'
import './plugins/vue-smart-layout-assistant'

// message box
import alert from '@/plugins/alert'
import confirm from '@/plugins/confirm'

// style
import './assets/styles/common.scss'

//
import * as ut from './plugins/utils'
import storage from '@/plugins/storage'

Vue.config.productionTip = false

// message box
Vue.use(alert)
Vue.use(confirm)
//
Vue.use(axios)

const start = async () => {
  const start = new Vue({
    store,
    render: h => h(Start)
  }).$mount('#start')
  const wait = hp.waitTime(1500) // show start page at least
  // auth
  const authToken = storage.get('auth_token')
  const axiosInstance = getAxiosInstance()
  if (authToken) {
    axiosInstance.defaults.headers.common['Authorization'] = authToken
  }
  const data = await Vue.api.get('initial-data', {
    headers: {Authorization: authToken}
  })
  Object.assign(store.state, data)
  await wait
  start.$destroy()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  ut.keepAlive.call(app)
}
start()
