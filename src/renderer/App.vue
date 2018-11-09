<template lang="pug">
v-app(v-if="routerReady")
  component(:is="'layout-'+($route.meta.layout || 'default')")
  //-
  CustomNotifications
</template>

<script>
import LayoutDefault from '@/layouts/default.vue'
import LayoutEmpty from '@/layouts/empty.vue'
import CustomNotifications from '@/plugins/CustomNotifications'

export default {
  name: 'App',
  components: {LayoutDefault, LayoutEmpty, CustomNotifications},
  data () {
    return {
    }
  },
  computed: {
    routerReady() {
      return this.$route.name || this.$route.path !== '/'
    },
  },
  mounted() {
  },
}
</script>
