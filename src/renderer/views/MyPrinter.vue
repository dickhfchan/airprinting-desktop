<template lang="pug">
.my-printer-page
  .headline
    span You have not configured a printer yet.
    v-btn.ml-3(color="accent" @click="configurePrinter") Configure
  PrinterForm(v-model="printerForm.visible")
</template>

<script>
import PrinterForm  from '@/dialogs/PrinterForm.vue'
export default {
  components: {PrinterForm},
  data() {
    return {
      printerForm: {
        visible: false,
      },
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    async configurePrinter() {
      this.printerForm.visible = true
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.my-printer-page{}
</style>
