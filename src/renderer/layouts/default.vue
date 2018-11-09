<template lang="pug">
v-app
  v-toolbar(color="accent", dark='', fixed='', app='' :clipped-left="$vuetify.breakpoint.lgAndUp")
    .ml-2
      v-toolbar-side-icon(@click.stop='drawer = !drawer')
    v-toolbar-title {{$store.state.siteName}}
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
  v-content
    transition(name="slide-x-transition" mode="out-in")
      router-view
</template>

<script>
export default {
  // components: {},
  data() {
    return {
      drawer: true,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.layout-default{
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
