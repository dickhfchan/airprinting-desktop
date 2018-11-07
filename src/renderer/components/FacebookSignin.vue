<template lang="pug">
.FacebookSignin(@click="click")
  slot
  //- fb:login-button(scope='public_profile,email', onlogin='checkLoginState();')
</template>

<script>
import electronFacebookAuth from '@/plugins/electronFacebookAuth'

export default {
  // components: {},
  props: {
    appId: {},
  },
  data() {
    return {
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    async click() {
      const response = await electronFacebookAuth({
        client_id: this.appId || this.$store.state.facebookSignin.appId,
      })
      this.$emit('success', response)
    },
    logout() {
      // nothing need to do now
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.FacebookSignin{}
</style>
