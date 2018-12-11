<template lang="pug">
.toast-component(v-if="visible")
  .toast-component-inner
    v-progress-circular(:size='35', indeterminate='')
    .mt-3(v-if="message") {{message}}
</template>

<script>
import Vue from 'vue'
import * as ut from '@/plugins/utils.js'

let readyResolve
const ready = new Promise(function(resolve, reject) {
  readyResolve = resolve
})

const toast = async (message) => {
  const vm = await ready
  vm.message = message
  vm.visible = true
}

const hideToast = async () => {
  const vm = await ready
  vm.visible = false
}

ut.injectDependency('toast', toast)
ut.injectDependency('hideToast', hideToast)

export default {
  components: {},
  data() {
    return {
      message: null,
      visible: false,
    }
  },
  // computed: {},
  // watch: {},
  // methods: {},
  // created() {},
  mounted() {
    readyResolve(this)
  },
}
</script>

<style lang="scss">
.toast-component{
  @include mask;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toast-component-inner{
  background-color: rgba(0, 0, 0, 0.46);
  border-radius: 5px;
  $side: 110px;
  width: $side;
  height: $side;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
}
</style>
