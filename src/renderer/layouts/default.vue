<template lang="pug">
v-app.layout-default
  v-toolbar(color="accent", dark='', fixed='', app='' :clipped-left="$vuetify.breakpoint.lgAndUp")
    .ml-2
      v-toolbar-side-icon(@click.stop='drawer = !drawer')
    v-toolbar-title {{$store.state.siteName}}
    v-spacer
    v-menu.mr-3(offset-y='')
      .user-btn.subheading(slot='activator')
        img.user-avatar(:src="$store.state.user.avatar")
        span {{$store.state.user.name}}
        v-icon arrow_drop_down
      v-list
        v-list-tile(@click="logout")
          v-list-tile-title Logout
  v-navigation-drawer(v-model='drawer', fixed='', app='' :clipped="$vuetify.breakpoint.lgAndUp")
    v-list.main-menu(dense='')
      v-list-tile(:to="{name: 'home'}")
        v-list-tile-action
          v-icon print
        v-list-tile-content
          v-list-tile-title My printer
      v-list-tile(@click='')
        v-list-tile-action
          v-icon settings
        v-list-tile-content
          v-list-tile-title Settings
  v-navigation-drawer(v-model='drawerRight', fixed='', right='', app='')
    v-list.main-menu(dense='')
      v-list-tile(:to="{name: 'home'}")
        v-list-tile-action
          v-icon print
        v-list-tile-content
          v-list-tile-title My printer
      v-list-tile(@click='')
        v-list-tile-action
          v-icon settings
        v-list-tile-content
          v-list-tile-title Settings
  v-content
    v-container(fluid)
      v-layout
        v-flex(xs12)
          PrintingTaskAlert
          transition(name="slide-x-transition" mode="out-in")
            router-view
</template>

<script>
import * as ut from '@/plugins/utils'
import PrintingTaskAlert from '@/components/PrintingTaskAlert'

export default {
  components: {PrintingTaskAlert},
  data() {
    return {
      drawer: true,
      drawerRight: true,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async logout() {
      ut.logout.call(this)
      await ut.pullUser.call(this)
      this.$router.push({name: 'login'})
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.layout-default{
  .user-btn{
    display: flex;
    align-items: center;
  }
  .user-avatar{
    $side: 43px;
    width: $side;
    height: $side;
    border-radius: 100%;
    margin-right: .5em;
    transition: all .5s;
    &:hover{
      transform: scale(1.4);
    }
  }
}
.main-menu{
  .list__tile.list__tile--link{
    height: 48px;
  }
  .list__tile__title{
    font-size: 16px;
  }
}
</style>
