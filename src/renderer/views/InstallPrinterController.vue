<template lang="pug">
.install-printer-controller-page
  p Connect your printer and device with the same network.
  p Start installing "AUTO ACCEPT" printing function. When customer request for printing you are able to automaticlly run the print from one tap.
  v-checkbox(label="Agree to the terms and conditions and privacy policy" v-model="agreed")
  v-btn(color="primary" block) Install Now
</template>

<script>
export default {
  components: {},
  data() {
    return {
      agreed: false,
    }
  },
  // computed: {},
  // watch: {},
  // methods: {},
  // created() {},
  mounted() {
    this.$store.state.toolbar.title = 'Install Printer Controller'
  },
}
</script>

<style lang="scss">
.install-printer-controller-page{
  padding: 50px 30px;
  p{
    font-size: 17px;
  }
}
</style>
