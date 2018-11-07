<template lang="pug">
v-dialog.sign-in-dialog(v-model="visible", fullscreen='', hide-overlay='', transition='dialog-bottom-transition')
  v-card.sign-in-card
    v-toolbar.toolbar-style1(dark='', color='accent' dense)
      v-toolbar-title
        v-btn.toolbar-icon-btn-style1(icon='', dark='', @click.native='visible = false')
          v-icon close
        span Sign in
    GoogleAndFacebookSignInBtns(@success="success")
</template>

<script>
import GoogleAndFacebookSignInBtns from '@/components/GoogleAndFacebookSignInBtns'
import * as ut from '@/plugins/utils'

export default {
  components: {GoogleAndFacebookSignInBtns},
  props: {
    value: {},
  },
  data() {
    return {}
  },
  computed: {
    visible: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },
  },
  // watch: {},
  methods: {
    success() {
      this.visible = false
    },
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
