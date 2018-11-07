<template lang="pug">
.GoogleSignin
  slot
</template>

<script>
import thirdApiInitialization from './thirdApiInitialization'

export default {
  extends: thirdApiInitialization,
  props: {
    clientId: {},
  },
  // components: {},
  data() {
    return {
      apiUrl: `https://apis.google.com/js/platform.js?onload=[callback]`,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    afterApiLoaded() {
      const clientId = this.clientId || this.$store.state.googleSignin.clientId
      const {gapi} = window
      return new Promise(function(resolve, reject) {
        gapi.load('auth2', () => {
         // Retrieve the singleton for the GoogleAuth library and set up the client.
         const auth2 = gapi.auth2.init({
           client_id: clientId,
           cookiepolicy: 'single_host_origin',
           // Request scopes in addition to 'profile' and 'email'
           //scope: 'additional_scope'
         });
         resolve(auth2)
       });
      });
    },
    logout() {
      this.readyPromise.then(auth2 => {
        auth2.disconnect()
      })
    },
  },
  // created() {},
  mounted() {
    this.readyPromise.then(auth2 => {
      auth2.attachClickHandler(this.$el, {}, (googleUser) => {
        this.$emit('success', googleUser)
      }, (error) => {
        console.warn(error);
        window.alert(error.error)
      })
    })
  },
}
</script>

<style lang="scss">
.GoogleSignin{}
</style>
