<template lang="pug">
v-app(v-if="routerReady")
  component(:is="'layout-'+($route.meta.layout || 'default')")
  //-
  CustomNotifications
  SignInDialog(v-model="$store.state.signInDialogVisible")
</template>

<script>
import LayoutDefault from '@/layouts/default.vue'
import LayoutEmpty from '@/layouts/empty.vue'
import CustomNotifications from '@/plugins/CustomNotifications'
import SignInDialog from '@/components/SignInDialog.vue'

export default {
  name: 'App',
  components: {LayoutDefault, LayoutEmpty, CustomNotifications, SignInDialog},
  data () {
    return {
    }
  },
  computed: {
    routerReady() {
      return this.$route.name || this.$route.path !== '/'
    },
  },
}
</script>
