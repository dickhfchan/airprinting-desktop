import Vue from 'vue'
import Vuetify from 'vuetify'
// style
// import 'vuetify/src/stylus/app.styl' // for custom style
import 'vuetify/dist/vuetify.min.css' // default style

Vue.use(Vuetify, {
  theme: {
    primary: "#004CE4",
    secondary: "#9299A9",
    accent: "#003398",
    error: "#f44336",
    warning: "#fdab15",
    info: "#2196f3",
    success: "#4caf50",
  },
})
