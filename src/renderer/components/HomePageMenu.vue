<template lang="pug">
v-dialog.home-page-menu(v-model="visible" fullscreen='', hide-overlay='', transition="slide-x-transition", scrollable)
  v-card.home-page-menu-card(tile )
    v-card-text
      .user-info
        v-layout.px-3.py-4(align-center)
          .user-avatar.mr-3
            .default-user-avatar(v-if="!$store.state.authenticated || !$store.state.user.avatar")
              v-icon person
            img(:src="$store.state.user.avatar")
          div
            template(v-if="!$store.state.authenticated")
              v-btn.ma-0(color="accent" @click.stop="$store.state.signInDialogVisible=true") Sign in
            template(v-else)
              .user-name Hi {{$store.state.user.name}}
            //- div.mt-1
            //-   v-btn.ma-0(color="warning" small outline) Logout
        //- hr
        //- .user-menu
        //-   .menu-item Do more with your account
        //-   .menu-item Get food delivery
        //-   .menu-item Make money driving
      .main-menu
        .menu-item Your Orders
        .menu-item(@click="onclickMenuItem({name: 'myPrinter'}, true)") My Printer
        .menu-item Cardits
        .menu-item Help (Chatbot)
        .menu-item Free Trial
        .menu-item Settings
        .menu-item Legal
        template(v-if="$store.state.authenticated")
          .menu-item(@click="logout") Logout
          GoogleSignin(ref="googleSignin")
          GoogleSignin(ref="facebookSignin")
    v-btn.close-btn(icon @click="visible = false")
      v-icon.grey--text() close
</template>

<script>
import GoogleSignin from '@/components/GoogleSignin'
import FacebookSignin from '@/components/FacebookSignin'

export default {
  components: {GoogleSignin, FacebookSignin},
  data() {
    return {
      visible: false,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    onclickMenuItem(route, auth) {
      if (auth && !this.$store.state.authenticated) {
        this.$store.state.signInDialogVisible = true
      } else {
        this.$router.push(route)
      }
    },
    async logout() {
      this.$refs.googleSignin.logout()
      this.$refs.facebookSignin.logout()
      await this.$api.post('/user/logout')
      this.$store.state.authenticated = false
      this.$store.state.user = {}
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.home-page-menu{
}
.home-page-menu-card{
  &.v-card{
    color: $accent;
  }
  .close-btn{
    position: absolute;
    right: 0;
  }
}
.user-info{
  .v-icon{
    color: #fff;
  }
  hr{
    border-color: #555;
    border-width: 1px;
  }
}
.user-avatar{
  $side: 100px;
  width: $side;
  height: $side;
  border: 1px solid $accent;
  border-radius: 100%;
  overflow: hidden;
  img{
    width: 100%;
  }
}
.default-user-avatar{
  $side: 100%;
  width: $side;
  height: $side;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .v-icon{
    color: #ccc;
    font-size: 60px;
  }
}
.user-name{
  font-size: 20px;
}
.user-menu{
  padding: 10px 0px;
}
.menu-item{
  padding: 10px 20px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
.main-menu{
  font-size: 1.3em;
}
</style>
