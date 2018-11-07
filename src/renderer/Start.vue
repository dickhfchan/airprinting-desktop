<template lang="pug">
.start-page.full-screen
  img.start-logo(src="@/assets/img-export/4x/start-logo.png")
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  // computed: {},
  // watch: {},
  // methods: {},
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.start-page{
  // background-color: $primary;
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-logo{
  width: 80%;
  max-width: 300px;
  position: relative;
  top: -30px;
}
</style>
