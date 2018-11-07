<template lang="pug">
v-dialog.time-input(ref='dialog', v-model='visible', :return-value.sync='time',
  persistent='', lazy='', full-width='', width='296px'
)
  v-text-field(slot='activator', v-model='time', :label="placeholder", prepend-icon='access_time', readonly='')
  v-time-picker(v-if='visible', v-model='time', full-width='')
    v-spacer
    v-btn(flat='', color='primary', @click='visible = false') Cancel
    v-btn(flat='', color='primary', @click='$refs.dialog.save(time)') OK
</template>

<script>
export default {
  components: {},
  props: {
    value: {},
    placeholder: {},
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    time: {
      get() { return this.value },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  // watch: {},
  // methods: {},
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.time-input{}
</style>
