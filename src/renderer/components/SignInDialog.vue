<template lang="pug">
v-dialog.sign-in-dialog(v-model="visible", fullscreen='', hide-overlay='', transition='dialog-bottom-transition')
  v-card.sign-in-card
    v-toolbar.toolbar-style1(dark='', color='accent' dense)
      v-toolbar-title
        span Sign in
    GoogleAndFacebookSignInBtns
</template>

<script>
import GoogleAndFacebookSignInBtns from '@/components/GoogleAndFacebookSignInBtns'
import * as ut from '@/plugins/utils'

export default {
  components: {GoogleAndFacebookSignInBtns},
  props: {},
  data() {
    return {}
  },
  computed: {
    visible() { return !this.$store.state.authenticated },
  },
  // watch: {},
  methods: {
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.sign-in-dialog{
}
.sign-in-card{
  .google-and-facebook-sign-in-btns{
    width: 80%;
    max-width: 300px;
    margin: 0 auto;
    margin-top:100px;
  }
}
</style>
