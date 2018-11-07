<template lang="pug">
.request-approved-page.full-screen
  .inner
    img.center-icon(src="@/assets/img-export/2x/o-approved.png")
    .text-style1.mt-2 Request approved by Printer
    v-btn.btn-style1.mt-4(color="primary" block) Print now
    v-btn.btn-style1.mt-2(color="secondary" block) Show direction to printer
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
.request-approved-page{
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
