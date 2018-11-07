<template lang="pug">
v-app.home-page
  v-toolbar.toolbar-style1(:clipped-left='$vuetify.breakpoint.lgAndUp' color="accent" dark app fixed dense)
    v-toolbar-title
      v-btn.back-btn.toolbar-icon-btn-style1(icon @click="goBack")
        v-icon arrow_back
      span {{$store.state.toolbar.title}}
  v-content
    transition(name="slide-x-transition" mode="out-in")
      router-view
</template>

<script>
export default {
  // components: {},
  // data() {
  //   return {
  //   }
  // },
  // computed: {},
  // watch: {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.layout-default{
}
</style>
