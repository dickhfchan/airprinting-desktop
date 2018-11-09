<template lang="pug">
.login-page.start-page.full-screen
  img.start-logo(ref="logo" :style="logoStyle" src="@/assets/img-export/4x/start-logo.png")
  .login-card.card(v-if="btnsVisible" ref="loginCard")
    div
    .user-avatar
      .default-user-avatar
        v-icon person
    GoogleAndFacebookSignInBtns.mt-4(@success="$router.push({name: 'home'})")
</template>

<script>
import * as hp from 'helper-js'
import anime from 'animejs'
import GoogleAndFacebookSignInBtns from '@/components/GoogleAndFacebookSignInBtns'

let first = true

export default {
  components: {GoogleAndFacebookSignInBtns},
  data() {
    return {
      logoStyle: null,
      btnsVisible: false,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    playAnimate(opt = {}) {
      const {logo} = this.$refs
      const {x, y} = hp.offsetToPosition(logo, hp.getOffset(logo))
      const translateY = {value: -155}
      if (opt.immediate) {
        translateY.duration = 0
      }
      const logoAnime = anime({
        targets: logo,
        translateY,
        easing: 'easeInOutQuad',
      })
      logoAnime.complete = () => {
        logo.style.transform = null
        this.btnsVisible = true
        this.$nextTick(() => {
          const opacity = {value: 1, duration: 800}
          if (opt.immediate) {
            opacity.duration = 0
          }
          anime({
            targets: this.$refs.loginCard,
            opacity,
            easing: 'easeInOutQuad',
          })
        })
      }
    },
  },
  // created() {},
  async mounted() {
    if (first) {
      await hp.waitTime(500)
      this.playAnimate()
      first = false
    } else {
      this.playAnimate({immediate: true})
    }
  },
}
</script>

<style lang="scss">
.login-page{
  .page-inner{
    text-align: center;
    width: 360px;
  }
  .login-card{
    width: 300px;
    padding: 30px;
    padding-bottom: 50px;
    box-sizing: content-box;
    opacity: 0;
  }
  .user-avatar{
    $side: 100px;
    width: $side;
    height: $side;
    border: 1px solid #e2e2e2;
    border-radius: 100%;
    overflow: hidden;
    margin: 0 auto;
    background-color: #eee;
  }
  .default-user-avatar{
    $side: 100%;
    width: $side;
    height: $side;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon{
      color: #ccc;
      font-size: 60px;
    }
  }
}
.start-page{
  background-color: $primary;
  display: flex;
  flex-direction: column;
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
