import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mode: process.env.NODE_ENV,
    authenticated: false,
    user: {},
    // dev
    api: `http://10.0.2.2:8081/api`,
    socket: `http://10.0.2.2:8081`,
    // prod
    // api: `https://knode.co:8088/api/v1`,
    // socket: `https://knode.co:8088`,
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
    config: {},
  },
  mutations: {},
  actions: {},
})
