<template lang="pug">
.printing-now-page.full-screen
  .inner
    img.center-icon(src="@/assets/img-export/2x/o-printing.png")
    .text-style1.mt-2 Your filename are printing now
    img.long-right-arrow.mt-3(src="@/assets/img-export/2x/long-right-arrow.png")
    v-btn.btn-style1.mt-5(color="primary" block) Show direction to printer
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
.printing-now-page{
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
  .btn-style1{
    text-transform: none;
    border-radius: 8px;
  }
}
</style>
