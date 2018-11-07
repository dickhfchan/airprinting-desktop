<template lang="pug">
.ready-to-print-page.full-screen
  .inner
    img.center-icon(src="@/assets/img-export/2x/o-printing.png")
    .text-style1.mt-2 Ready to print?
    v-btn.btn-style1.mt-3(color="primary" block) Print now
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
.ready-to-print-page{
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
