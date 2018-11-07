<script>
import thirdApiInitialization from './thirdApiInitialization'

export default {
  extends: thirdApiInitialization,
  props: {
    apikey: {},
  },
  // components: {},
  // data() {
  //   return {
  //   }
  // },
  computed: {
    apikey2() { return this.apikey || this.$store.state.googleMap.apikey },
    apiUrl() { return `https://maps.googleapis.com/maps/api/js?key=${this.apikey2}&libraries=places&callback=[callback]` },
  },
  // watch: {},
  // methods: {},
}
</script>

<style lang="scss">
.GoogleMap{
  position: relative;
  min-height: 300px;
}
.GoogleMap_map{
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
