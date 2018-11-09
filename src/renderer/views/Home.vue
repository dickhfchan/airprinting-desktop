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
        v-list-tile(:to="{name: 'editPrinter'}")
          v-list-tile-content
            v-list-tile-title Windows wps
          v-list-tile-action
            v-icon keyboard_arrow_right
</template>

<script>
export default {
  components: {},
  data() {
    return {
      configuring: false,
      configurePrinterDialog: {
        visible: false,
      },
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    configurePrinter() {
      this.configuring = true
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
