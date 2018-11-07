<template lang="pug">
.GoogleMap
  .GoogleMap_map(ref="map")
</template>

<script>
import * as hp from 'helper-js'
import * as mapUtils from '@/plugins/mapUtils.js'
import isMobile from 'ismobilejs'
import makeGoogleMapMyLocationBtn from '@/plugins/googleMapMyLocationBtn'
import GoogleMap from '@/components/GoogleMap.vue'
import mapStyles from '@/other/googleMapStyles.js'
import mapCrossImg from '@/assets/img-export/2x/map-cross.png'
import printerImg from '@/assets/img-export/2x/printer.png'
import printerActiveImg from '@/assets/img-export/2x/printer-active.png'

export default {
  extends: GoogleMap,
  props: {
    options: {},
  },
  // components: {},
  data() {
    return {
      map: null,
      mapReadyPromise: new Promise((resolve, reject) => {
        this.mapReadyPromiseResolve = resolve
      }),
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    initMap() {
      const {google} = window
      const map = this.map = new google.maps.Map(this.$refs.map, {
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: !isMobile.any,
        // streetViewControl: false,
        styles: mapStyles,
      })
      google.maps.event.addListener(map, "click", (event) => {
        if (this._lastOpenPrinterInfo) {
          this._lastOpenPrinterInfo.infowindow.setMap(null)
          this._lastOpenPrinterInfo.infowindow = null
          this._lastOpenPrinterInfo = null
        }
      })
      google.maps.event.addListener(map, "dragend", () => {
        const pos = this.getMapCenter()
        this.currentPositionMarker.setPosition(pos)
        this.emitItIsTimeToUpdatePrinters(pos)
      })
      // add my location btn to map
      const myLocationBtn = makeGoogleMapMyLocationBtn()
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(myLocationBtn)
      hp.onDOM(myLocationBtn, 'click', () => {
        this.updateSelfMarkerWithCurrentPositionAndSetAsMapCenter()
      })
      //
      this.mapReadyPromiseResolve(map)
    },
    updateSelfMarkerWithCurrentPositionAndSetAsMapCenter() {
      const update = (position) => {
        const map = this.map
        const pos = this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        if (!this.currentPositionMarker) {
          const mapCrossIcon = {
            url: mapCrossImg,
            scaledSize: new google.maps.Size(25, 25),
          }
          this.currentPositionMarker = new google.maps.Marker({position: pos, map, icon: mapCrossIcon});
        } else {
          this.currentPositionMarker.setPosition(pos)
        }
        map.setCenter(pos)
        this.emitItIsTimeToUpdatePrinters(pos)
      }
      mapUtils.getCurrentPosition(update, (e) => {
        // failed
        // default position
        this.$notifyError(`Failed to get your current position.`)
        update({
          coords: {
            latitude: 51.3800507,
            longitude: -0.0737944,
          }
        })
      })
    },
    async updatePrinterMarkers(printers) {
      const {map, currentPosition} = this
      if (!this.printerInfos) {
        this.printerInfos = []
      }
      const {printerInfos} = this
      // remove extra old printer
      const t = {}
      printers.forEach(({position}) => {
        t[`${position.lat}_${position.lng}`] = true
      })
      const existed = {}
      for (let i = printerInfos.length - 1; i >= 0 ; i--) {
        const info = printerInfos[i]
        const {position} = info
        if (t[`${position.lat}_${position.lng}`]) {
          existed[`${position.lat}_${position.lng}`] = true
        } else {
          // remove
          info.marker.setMap(null)
          if (info.infowindow) {
            info.infowindow.setMap(null)
            this._lastOpenPrinterInfo = null
          }
          printerInfos.splice(i, 1)
        }
      }
      // add new printer
      const printerIcon = {
        url: printerImg,
        scaledSize: new google.maps.Size(18, 18),
      }
      const printerNearestIcon = {
        url: printerActiveImg,
        scaledSize: new google.maps.Size(18, 18),
      }
      printers.forEach(printer => {
        const {position} = printer
        if (!existed[`${position.lat}_${position.lng}`]) {
          const info = {
            data: printer,
            position,
            distance: null,
            marker: new google.maps.Marker({
              position: position,
              map,
              icon: printerIcon,
            }),
          }
          info.marker.addListener('click', () => {
            this.clickPrinter(info)
          });
          printerInfos.push(info)
        }
      })
      // get printer distance
      const noDistanceInfos = []
      const noDistancePositions = []
      printerInfos.forEach((info, i) => {
        if (!info.distance) {
          noDistanceInfos.push(info)
          noDistancePositions.push(info.position)
        }
      })
      const distanceInfo = await this.$api.post('/google-map/distance', {
        origins: [currentPosition],
        destinations: noDistancePositions,
      })
      noDistanceInfos.forEach((info, i) => {
        info.distance = distanceInfo.rows[0].elements[i].distance
      })
      // find nearest printer info
      let nearest
      printerInfos.forEach(info => {
        if (!nearest || nearest.distance.value > info.distance.value) {
          nearest = info
        }
      })
      nearest.nearest = true
      nearest.marker.setIcon(printerNearestIcon)
    },
    autoZoomAndSetCenter() {
      const map = this.map
      const bounds  = new google.maps.LatLngBounds()
      const markers = this.printerInfos.map(v => v.marker)
      markers.push(this.currentPositionMarker)
      for (const marker of markers) {
        const loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng())
        bounds.extend(loc)
      }
      map.fitBounds(bounds)
      map.panToBounds(bounds)
      map.setCenter(this.currentPosition)
    },
    getMapCenter() {
      const t = this.map.getCenter()
      return {
        lat: t.lat(),
        lng: t.lng(),
      }
    },
    // private methods
    async clickPrinter(info) {
      const {map} = this
      if (info.infowindow) {
        if (info.infowindow.map) {
          // existed
          return
        }
      }
      const contentString = `
<div class="marker-infowindow" id="printerInfowindow_${info.data.id}">
  <h3 class="printer-title">
    Jim's Printer
    <span class="printer-distance">${info.distance && info.distance.text || ''}</span>
    <span class="nearest-text">${info.nearest ? '(Nearest)' : ''}</span>
  </h3>
  <div>
    <span class="printer-address">1000 N Village Ave, Rockville Centre, NY 11570美国</span>
  </div>
  <div>
    <label>Support:</label> <span>A4, Color, Double Sided</span>
  </div>
  <div>
    <label>Price(per side): $${info.data.price}</label>
  </div>
    <button type="button" class="infowindow-next-btn v-btn theme--light v-btn--small v-btn--block accent" style="position: relative;">
      <a class="v-btn__content" onclick="return gmap_onclickPrinterNextBtn(${info.data.id})">Next</a>
    </button>
  <div>
  </div>
</div>
`.trim();
       const infowindow = new google.maps.InfoWindow({
         content: contentString
       });
       info.infowindow = infowindow
       infowindow.open(map, info.marker);
       infowindow.addListener('closeclick', () => {
         if (this._lastOpenPrinterInfo) {
           this._lastOpenPrinterInfo.infowindow = null
           this._lastOpenPrinterInfo = null
         }
       })
       if (this._lastOpenPrinterInfo) {
         this._lastOpenPrinterInfo.infowindow.setMap(null)
         this._lastOpenPrinterInfo.infowindow = null
       }
       this._lastOpenPrinterInfo = info
    },
    emitItIsTimeToUpdatePrinters(pos) {
      const oldCenter = this._lastMapCenter
      if (oldCenter && JSON.stringify(oldCenter) === JSON.stringify(pos)) {
        return
      }
      this._lastMapCenter = pos
      this.$emit('itIsTimeToUpdatePrinters', pos, oldCenter)
    },
  },
  // created() {},
  async mounted() {
    await this.readyPromise
    this.initMap()
    await this.mapReadyPromise
    this.updateSelfMarkerWithCurrentPositionAndSetAsMapCenter()
    //
    window.gmap_onclickPrinterNextBtn = async (id) => {
      // todo: remove in production
      const data = await this.$api.post('printer/select')
      id = data[0].id
      this.$router.push({name: 'uploadPdf', query: {id}})
      return false
    }
  },
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
.marker-infowindow{
  max-width: 255px;
  line-height: 20px;
  .printer-title{
    font-weight: 500;
    margin-bottom: 5px;
  }
  .printer-distance{
    color: $accent;
    font-weight: 400;
    font-size: .9em;
    letter-spacing: -1px;
  }
  .printer-address{
    color: $accent;
    font-weight: 500;
    margin-bottom: 50px;
  }
  .nearest-text{
    color: $secondary;
  }
  label{
    color: $accent;
    font-weight: 500;
  }
}
.infowindow-next-btn{
  margin: 0;
  margin-top: 10px;
  a{
    text-decoration: none;
  }
}
</style>
