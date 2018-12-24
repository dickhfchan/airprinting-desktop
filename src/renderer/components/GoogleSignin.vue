<template lang="pug">
.GoogleSignin(@click="click")
  slot
</template>

<script>
import electronGoogleAuth from '@/plugins/electronGoogleAuth';

export default {
  props: {
    clientId: {},
  },
  // components: {},
  data() {
    return {
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    async click() {
      const code = await electronGoogleAuth({
        client_id: this.clientId || this.$store.state.config.GOOGLE_SINGIN_CLIENT_ID,
      })
      this.$emit('success', code)
    },
    logout() {
      // nothing need to do now
    },
  },
  // created() {},
  mounted() {
  },
}
</script>

<style lang="scss">
.GoogleSignin{}
</style>
