<template lang="pug">
.map-address-select(@click="toSearch" v-if="value")
  v-text-field.mt-2.map-address-text-field(
    label="Address" v-model="value.formattedAddress" hide-details append-icon="edit_location"
  )
  .map-address-text-field-mask
  v-dialog(v-model="dialog.visible" fullscreen='', hide-overlay='', transition='dialog-bottom-transition', scrollable)
    v-card.map-address-select-card(tile='')
      v-toolbar(dark color='accent')
        v-btn(icon dark @click.native="dialog.visible=false")
          v-icon close
        v-toolbar-title
          span Select Address on Map
      //-
      form(@submit.prevent="search")
        v-text-field.search-input(hide-details=''
          ref="search"
          append-icon="search"
          :append-icon-cb="search"
          @focus="searching=true"
          single-line='' placeholder="Search Address"
          v-model="searchText"
          @input="searchInputing"
        )
        button.hidden(type="submit")
      //-
      .GoogleMap_area
        .GoogleMap_map(ref="map")
        .possible-addresses
          .addresses-list-title Addresses
          v-list
            v-list-tile(
              v-for='(item, index) in possibleAddresses' :key='item.placeId',
              :class="{active: item.placeId === value.placeId}" @click='selectAddress(item)'
            )
              v-list-tile-content
                v-list-tile-sub-title(v-html='item.formattedAddress')
        v-card.serach-results(v-if="searching")
          .addresses-list-title Results
          v-list
            v-list-tile(
              v-for='(item, index) in searched' :key='item.placeId',
              @click='selectSearchResult(item)'
            )
              v-list-tile-content
                v-list-tile-sub-title(v-html='item.formattedAddress')
</template>

<script>
// todo failed get current position in electron
import * as hp from 'helper-js'
import GoogleMap from '@/components/GoogleMap.vue'
import mapStyles from '@/other/googleMapStyles.js'
import * as mapUtils from '@/plugins/mapUtils.js'
import makeGoogleMapMyLocationBtn from '@/plugins/googleMapMyLocationBtn'
import mapCrossImg from '@/assets/img-export/2x/map-cross.png'

export default {
  extends: GoogleMap,
  components: {},
  props: {
    value: {},
  },
  data() {
    return {
      dialog: {
        visible: false,
      },
      mapReadyPromise: new Promise((resolve, reject) => {
        this.mapReadyPromiseResolve = resolve
      }),
      possibleAddresses: [],
      searching: false,
      searchText: null,
      searched: [],
    }
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (!value) {
          this.$emit('input', {
            formattedAddress: null,
            placeId: null,
            latlng: {
              lat: null,
              lng: null,
            },
          })
        }
      }
    },
    'dialog.visible': {
      immediate: true,
      async handler(visible) {
        if (!visible) {
          this.searching = false
        }
        //
        if (!this._visibleChanged) {
          this._visibleChanged = true
          return
        }
        if (visible && !this._once_mapInit) {
          this._once_mapInit = true
          await this.readyPromise
          this.initMap()
        }
        // getPossibleAddresses and set map center
        await this.readyPromise
        let {latlng} = this.value
        if (!latlng.lat) {
          const position = await mapUtils.getCurrentPositionPromise()
          latlng = {lat: position.coords.latitude, lng: position.coords.longitude}
        }
        this.getPossibleAddresses(latlng)
        const map = await this.mapReadyPromise
        map.setCenter(latlng)
        this.mapCenterMarker.setPosition(latlng)
      }
    }
  },
  methods: {
    initMap() {
      const {google} = window
      const map = this.map = new google.maps.Map(this.$refs.map, {
        zoom: 17,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: true,
        // streetViewControl: false,
        styles: mapStyles,
      })
      // map center marker
      const mapCrossIcon = {
        url: mapCrossImg,
        scaledSize: new google.maps.Size(25, 25),
      }
      const marker = this.mapCenterMarker = new google.maps.Marker({map, icon: mapCrossIcon})
      // my location btn
      const btn = makeGoogleMapMyLocationBtn()
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(btn)
      hp.onDOM(btn, 'click', async () => {
        const position = await mapUtils.getCurrentPositionPromise()
        const latlng = {lat: position.coords.latitude, lng: position.coords.longitude}
        map.setCenter(latlng)
        marker.setPosition(latlng)
        this.getPossibleAddresses(latlng)
      })
      //
      this.mapReadyPromiseResolve(map)
    },
    async getPossibleAddresses(latlng) {
      const geocoder = new window.google.maps.Geocoder
      geocoder.geocode({location: latlng}, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            let items = results.filter(v => v.types.includes('street_address') || v.types.includes('neighborhood'))
            items = transfromGeocodeResults(items)
            this.possibleAddresses = items
          } else {
            console.warn(`Can't found your address by your current latlng.`)
          }
        } else {
          this.$notifyError(`Error: ${status}`)
        }
      })
    },
    toSearch() {
      this.dialog.visible = true
    },
    selectAddress(item) {
      this.$emit('input', {
        formattedAddress: item.formattedAddress,
        placeId: item.placeId,
        latlng: {
          lat: item.geometry.location.lat(),
          lng: item.geometry.location.lng(),
        },
      })
      this.searching = false
      this.dialog.visible = false
    },
    // search
    cancelSearch() {
      this.$refs.search.blur()
      this.searching = false
    },
    search() {
      const service = new google.maps.places.AutocompleteService
      service.getPlacePredictions({
        input: this.searchText,
        types: ['address'],
      }, (items) => {
        items = transfromGeocodeResults(items)
        this.searched = items
      })
    },
    searchInputing() {
      if (this._searchInputingTimeout) {
        clearTimeout(this._searchInputingTimeout)
        this._searchInputingTimeout = null
      }
      this._searchInputingTimeout = setTimeout(() => {
        this.search()
        this._searchInputingTimeout = null
      }, 300)
    },
    selectSearchResult(item) {
      const geocoder = new window.google.maps.Geocoder
      geocoder.geocode({placeId: item.place_id}, (results, status) => {
        if (status === 'OK') {
          const items = transfromGeocodeResults(results)
          this.selectAddress(items[0])
        } else {
          this.$notifyError(`Error: ${status}`)
        }
      })
    },
  },
  // created() {},
  // async mounted() {},
}
function transfromGeocodeResults(results) {
  results.forEach(item => {
    item.formattedAddress = item.formatted_address || item.description
    item.placeId = item.place_id
  })
  return results
}
</script>

<style lang="scss">
.map-address-select{
  position: relative;
}
.map-address-text-field-mask{
  position: absolute;
  @include mask;
  height: 101%;
  height: calc(100% + 2px);
}
.map-address-select-card{
  .GoogleMap_area{
    flex-grow: 1;
    position: relative;
  }
  .GoogleMap_map{
    @include mask;
    height: 74%;
  }
  .possible-addresses{
    position: absolute;
    width: 100%;
    height: 26%;
    bottom: 0;
    left: 0;
    overflow: auto;
    border-top: 1px solid #c8d7d4;
    padding-top: 8px;
  }
  .addresses-list-title{
    padding: 0px 16px;
    font-weight: bold;
    color: $primary;
  }
  .active .v-list__tile__sub-title{
    color: $primary;
  }
  // search
  .search-input{
    padding-top: 0;
     .v-input__slot{
      min-height: 42px;
    }
    input{
      margin-top: 6px;
      padding: 25px 20px;
    }
    .v-input__prepend-inner{
      margin-top: 10px;
    }
    .v-input__append-inner{
      margin-top: 10px;
    }
  }
  .serach-results{
    @include mask;
    background-color: #fff;
    overflow: auto;
    padding-top: 8px;
  }
}
</style>
