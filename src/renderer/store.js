import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mode: process.env.NODE_ENV,
    authenticated: false,
    user: {},
    // dev
    // api: `http://10.0.2.2:8081/api/v1`,
    // socket: `http://10.0.2.2:8081`,
    // prod
    api: `http://54.179.187.95:8072/api`,
    socket: `http://54.179.187.95:8072`,
    printerFilterInfo: {
      size: [
        {text: 'A4', value: 'a4'},
        {text: 'A3', value: 'a3'},
      ],
      color: [
        {text: 'B/W', value: 'b/w'},
        {text: 'Color', value: 'color'},
      ],
      side: [
        {text: 'Single', value: 'single'},
        {text: 'Double', value: 'double'},
      ],
    },
    lastSelectedPrinterOptions: null,
    // ui
    toolbar: {
      title: null,
    },
    signInDialogVisible: false,
    // from backend
    recaptcha: null,
    googleSignin: null,
    googleMap: null,
    facebookSignin: null,
    siteHomeTitle: null,
    siteName: null,
    payment: null,
    s3: null,
    stripe: null,
    order: null,
  },
  mutations: {},
  actions: {},
})
