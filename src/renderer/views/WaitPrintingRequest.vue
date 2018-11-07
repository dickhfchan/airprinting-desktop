<template lang="pug">
.wait-printing-request-page.full-screen
  .inner
    img.center-icon(src="@/assets/img-export/2x/o-wait.png")
    .text-style1.mt-2 Please wait, we are senting out the printing request
    img.long-right-arrow.mt-3(src="@/assets/img-export/2x/long-right-arrow.png")
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
.wait-printing-request-page{
  display: flex;
  align-items: center;
  .inner{
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
  .center-icon{
    width: 150px;
  }
  .text-style1{
    font-size: 20px;
    color: $color5;
  }
  .long-right-arrow{
    width: 230px;
  }
}
</style>
