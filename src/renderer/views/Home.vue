<template lang="pug">
.home-page
  .headline
    span You have not configured a printer yet.
    v-btn.ml-3(color="accent" @click="configurePrinter" :loading="configuring") Configure
  v-dialog(v-model="configurePrinterDialog.visible", max-width='500px')
    v-card
      v-card-title
        .headline Choose a printer
      v-list
        v-list-tile(v-for="name in printerNames" :key="name" :to="{name: 'editPrinter'}")
          v-list-tile-content
            v-list-tile-title {{name}}
          v-list-tile-action
            v-icon keyboard_arrow_right
</template>

<script>
import Printer from '@/printer/Printer.js'

export default {
  components: {},
  data() {
    return {
      configuring: false,
      configurePrinterDialog: {
        visible: false,
      },
      printerNames: null,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    async configurePrinter() {
      this.configuring = true
      const printerNames = await Printer.getInstalledPrinterNames()
      this.configuring = false
      this.printerNames = printerNames
      this.configurePrinterDialog.visible = true
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.home-page{}
</style>
