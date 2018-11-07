<template lang="pug">
.my-printer-page.relative
  LoadingBox(v-if="!data")
  .pa-2(v-else)
    v-card
      v-card-text
        b Status:
        span.ml-1(:class="(data.active ? 'success' : 'error') + '--text'") {{data.active ? 'active' : 'inactive'}}
        v-btn(icon color="accent" small @click="refresh")
          v-icon refresh
        v-subheader.pa-0 {{data.inactiveReason}}
        v-divider
        v-list
          v-list-tile(v-for="(item, i) in list" :key="i" :to="item.route")
            v-list-tile-content
              v-list-tile-title {{item.text}}
            v-list-tile-action
              v-btn(icon='', ripple='')
                v-icon(color='grey') keyboard_arrow_right
        v-btn(v-if="data.active" @click="toggleStatus" :loading="toggling" color="warning" block) Suspend My Printer
        v-btn(v-else @click="toggleStatus" :loading="toggling" color="success" block) Open My Printer
</template>

<script>
import LoadingBox from '@/components/LoadingBox.vue'

export default {
  components: {LoadingBox},
  data() {
    return {
      data: null,
      list: [
        {text: 'Printer basic info', route: {name: 'printerBasicInfo'}},
        {text: 'Printer device', route: {name: 'printerDevice'}},
        {text: 'Opening hours', route: {name: 'printerOpeningHours'}},
      ],
      toggling: false,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    async pull() {
      const data = await this.$api.post('printer/mine')
      this.data = data
    },
    async refresh() {
      this.data = null
      await this.pull()
    },
    async toggleStatus() {
      await this.$confirm(`Are you sure to ${this.data.active ? 'suspend' : 'open'} yout printer?`)
      this.toggling = true
      try {
        await this.$api.post('printer/toggle-status')
        await this.pull()
        this.$notifySuccess('Toggled successfully.')
      } finally {
        this.toggling = false
      }
    },
  },
  // created() {},
  mounted() {
    this.$store.state.toolbar.title = 'My Printer'
    this.pull()
  },
}
</script>

<style lang="scss">
.my-printer-page{}
</style>
