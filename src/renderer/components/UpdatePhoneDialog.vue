<template lang="pug">
v-dialog.update-phone-dialog(v-model="visible", fullscreen='', hide-overlay='', transition='dialog-bottom-transition')
  v-card.update-phone-card
    v-toolbar(dark='', color='primary' dense)
      v-btn(icon='', dark='', @click.native='visible = false')
        v-icon close
      v-toolbar-title Update Phone Number
    .pa-2
      //- small Please fill your phone number
      v-alert(:value='true', type='info')
        | We need your phone to notify you by sms when the print task done.
      v-text-field.mt-3(label="Phone Number" v-model="phone")
      v-layout
        v-spacer
        v-btn(color="primary" @click="pushUser" :loading="loading") Update
</template>

<script>
import * as ut from '@/plugins/utils'

export default {
  components: {},
  props: {
    value: {},
  },
  data() {
    return {
      loading: false,
      phone: null,
    }
  },
  computed: {
    visible: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },
  },
  // watch: {},
  methods: {
    async pushUser() {
      this.loading = true
      try {
        const phone = this.phone.replace(/ /g, '')
        await this.$api.post('user/update', {phone,})
        await ut.pullUser.call(this)
        this.$store.state.updatePhoneDialogVisible = false
      } finally {
        this.loading = false
      }
    },
  },
  // created() {},
  mounted() {
    if (!this.$store.state.user.phone) {
      this.phone = '+852'
    } else {
      this.phone = this.$store.state.user.phone
    }
  },
}
</script>

<style lang="scss">
.update-phone-dialog{
}
.update-phone-card{
}
</style>
