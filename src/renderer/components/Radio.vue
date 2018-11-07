<template lang="pug">
.radio(:class="{active: computedValue}" @click="computedValue=!computedValue")
  input.radio-input(type="checkbox" v-model="computedValue")
  v-icon.radio-icon() {{computedValue ? 'radio_button_checked' : 'radio_button_unchecked'}}
  slot
</template>

<script>
import * as vf from 'vue-functions'

export default {
  // components: {},
  props: {
    value: {required: true},
    value2: {},
    nullable: {},
  },
  // data() {
  //   return {}
  // },
  computed: {
    computedValue: {
      get() {
        return this.value === this.value2
      },
      set(value) {
        if (value) {
          this.$emit('input', this.value2)
        } else {
          this.$emit('input', vf.isPropTrue(this.nullable) ? null : this.value2)
        }
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
.radio{
  display: inline-block;
  vertical-align: middle;
  position: relative;
  &.active .radio-icon{
    color: $accent;
  }
}
.radio-input{
  display: none;
}
</style>
