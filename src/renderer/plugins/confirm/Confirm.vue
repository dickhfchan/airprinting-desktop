<template lang="pug">
v-dialog.confirm-dialog(v-model='visible' v-bind="options")
  v-card.confirm-dialog-card
    v-card-title.headline {{title}}
    v-card-text {{message}}
    v-card-actions
      v-spacer
      v-btn(color="warning" @click.native="visible = false") Cancel
      v-btn(color="primary" @click.native="ok") OK
</template>

<script>
export default {
  components: {},
  data() {
    return {
      visible: true,
      title: null,
      message: null,
      options: null,
    }
  },
  // computed: {},
  watch: {
    visible(visible) {
      if (!visible) {
        if (this.isOk) {
          this.resolve()
        } else {
          this.reject()
        }
        // destroy after closure animation
        setTimeout(() => this.destroy(), 5000)
      }
    },
  },
  methods: {
    ok() {
      this.isOk = true
      this.visible = false
    },
    destroy() {
      this.$destroy()
      this.$el.parentElement.removeChild(this.$el)
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.confirm-dialog{
  @media(max-width: $small) {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}
.confirm-dialog-card{
  .v-btn{
    line-height: 100%;
  }
}
</style>
