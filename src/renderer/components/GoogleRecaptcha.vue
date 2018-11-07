<template lang="pug">
.GoogleRecaptcha()
</template>

<script>
import thirdApiInitialization from './thirdApiInitialization'

export default {
  extends: thirdApiInitialization,
  props: {
    sitekey: {},
  },
  // components: {},
  data() {
    return {
      apiUrl: `https://www.google.com/recaptcha/api.js?onload=[callback]`,
      callbackName: `GoogleRecaptchaCallback_${this._uid}`,
    }
  },
  computed: {
    sitekey2() {
      try {
        return this.sitekey || this.$store.state.recaptcha.sitekey
      } catch (e) {}
    },
  },
  // watch: {},
  methods: {
    getToken() {
      return this.readyPromise.then(() => {
        const {grecaptcha} = window
        const callbackProm = new Promise((resolve, reject) => {
          window[this.callbackName] = resolve
        })
        if (this.grecaptchaExecuted) {
          grecaptcha.reset(this.grecaptchaId)
        }
        grecaptcha.execute(this.grecaptchaId)
        this.grecaptchaExecuted = true
        return callbackProm
      })
    },
  },
  // created() {},
  mounted() {
    this.readyPromise.then(() => {
      this.grecaptchaId = window.grecaptcha.render( this.$el, { sitekey : this.sitekey2, size: 'invisible', callback: this.callbackName });
    })
  },
}
</script>

<style lang="scss">
.GoogleRecaptcha{}
</style>
