<template lang="pug">
.printed-page.full-screen
  .inner
    img.center-icon.print-done-icon(src="@/assets/img-export/2x/o-print-done.png")
    .text-style1.mt-2 Printed.
    v-btn.btn-style1.mt-3(color="primary" block) Collect
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
.printed-page{
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
  //
  .print-done-icon{
    // position: relative;
    // left: 100x;
    margin-left: 15px;
  }
}
</style>
