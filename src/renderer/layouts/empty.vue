<template lang="pug">
.layout-empty
  transition(name="slide-x-transition" mode="out-in")
    router-view
</template>

<script>
export default {
  // components: {},
  // data() {
  //   return {}
  // },
  // computed: {},
  // watch: {},
  // methods: {},
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.layout-empty{}
</style>
