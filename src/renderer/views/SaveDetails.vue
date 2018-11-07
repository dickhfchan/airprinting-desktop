<template lang="pug">
.save-details-page.full-screen
  .inner
    img.center-icon.print-done-icon(src="@/assets/img-export/2x/o-save.png")
    .text-style1.mt-2 Save your details with
    GoogleAndFacebookSignInBtns.mt-3
</template>

<script>
import GoogleAndFacebookSignInBtns from '@/components/GoogleAndFacebookSignInBtns.vue'
export default {
  components: {GoogleAndFacebookSignInBtns},
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
.save-details-page{
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
