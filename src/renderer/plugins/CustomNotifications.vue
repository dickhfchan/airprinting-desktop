<template lang="pug">
notifications
</template>

<script>
import Vue from 'vue'
import Notifications from 'vue-notification'
import * as ut from '@/plugins/utils.js'

Vue.use(Notifications)

let notifyReadyResolve
const notifyReady = new Promise(function(resolve, reject) {
  notifyReadyResolve = resolve
})
const notify = function (...args) {
  notifyReady.then(vm => vm.$notify(...args))
}

ut.injectDependency('notifySuccess', (text, title = 'Successful') => notify({title, text, type: 'success'}))
ut.injectDependency('notifyInfo', (text, title = 'Info') => notify({title, text}))
ut.injectDependency('notifyWarn', (text, title = 'Warning') => notify({title, text, type: 'warn'}))
ut.injectDependency('notifyError', (text, title = 'Failed') => notify({title, text, type: 'error'}))

export default {
  components: {},
  data() {
    return {}
  },
  // computed: {},
  // watch: {},
  // methods: {},
  // created() {},
  mounted() {
    notifyReadyResolve(this)
  },
}
</script>

<style lang="scss">
.notifications{
  top: 10px!important;
  right: 10px!important;
}
</style>
