<template lang="pug">
.dev-page
  div: router-link(:to="{name: 'home'}") home
  div: router-link(:to="{name: 'uploadPdf'}") uploadPdf
  div: router-link(:to="{name: 'payment'}") payment
  div: router-link(:to="{name: 'waitPrintingRequest'}") waitPrintingRequest
  div: router-link(:to="{name: 'requestApproved'}") requestApproved
  div: router-link(:to="{name: 'printingNow'}") printingNow
  div: router-link(:to="{name: 'readyToPrint'}") readyToPrint
  div: router-link(:to="{name: 'printed'}") printed
  div: router-link(:to="{name: 'saveDetails'}") saveDetails
  div: router-link(:to="{name: 'installPrinterController'}") installPrinterController
  div: router-link(:to="{name: 'waitPrinterControllerInstalling'}") waitPrinterControllerInstalling
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  // computed: {},
  // watch: {},
  // methods: {},
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.dev-page{}
</style>
