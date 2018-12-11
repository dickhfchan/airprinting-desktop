<template lang="pug">
.address-input
  .address-display(@click="dialog.visible=true")
    .address-display-left
      template(v-if="hasValue")
        .address-line1 {{data.address.formattedAddress}}
        .address-line2 {{data.addressDetail}}
        .address-line3 {{data.contactName}} {{data.areaCode}}{{data.phone}}
      .address-line3(v-else) No address selected
    v-btn.edit-btn(icon)
      v-icon keyboard_arrow_right
  v-dialog(v-model="dialog.visible" fullscreen='', hide-overlay='', transition='dialog-bottom-transition', scrollable)
    v-card.address-input-card(tile='' v-if="dialog.visible")
      v-toolbar(dark color='accent')
        v-btn(icon dark @click.native="closeDialog")
          v-icon close
        v-toolbar-title
          span Edit Address
      v-card-text
        v-layout
          v-flex(xs4)
            v-text-field(label="Area Code" v-model="data.areaCode" hide-details)
          v-flex.ml-3(xs8)
            v-text-field(label="Phone Number" v-model="data.phone" hide-details)
        v-text-field.mt-2(label="Contact Name" v-model="data.contactName" hide-details)
        MapAddressSelect.mt-2(v-model="data.address")
        v-text-field.mt-2(label="Address Detail" v-model="data.addressDetail" hide-details)
        v-btn.mt-3(color="accent" block @click="saveAddress") Save
</template>

<script>
import validate from 'validate.js'
import * as hp from 'helper-js'
import valueDetailsComponent from '@/plugins/valueDetailsComponent'
import MapAddressSelect from '@/components/MapAddressSelect.vue'

export default {
  extends: valueDetailsComponent,
  components: {MapAddressSelect},
  props: {
    value: {},
  },
  data() {
    return {
      dialog: {
        visible: false,
      },
      data: this.getDefaultData(),
    }
  },
  computed: {
    hasValue() { return this.data.address && this.data.address.formattedAddress },
  },
  // watch: {},
  methods: {
    getDefaultData() {
      return {
        areaCode: '+852',
        phone: null,
        contactName: null,
        address: null,
        addressDetail: null,
      }
    },
    validate() {
      const constraints = {
        areaCode: {
          presence: true,
        },
        phone: {
          presence: true,
        },
        contactName: {
          presence: true,
        },
        addressDetail: {
          presence: true,
        },
      }
      const validateResult = validate(this.data, constraints)
      if (validateResult) {
        return Object.values(validateResult)[0][0]
      }
      if (!this.data.address.formattedAddress) {
        return `Address can't be blank`
      }
    },
    saveAddress() {
      const validateResult = this.validate()
      if (validateResult) {
        this.$alert(validateResult)
        return
      }
      const cloned = hp.mapObjectTree(this.data, () => null)
      this.setValue(cloned)
      this.dialog.visible = false
    },
    getValueDetails(value) {
      this.data = value ? hp.mapObjectTree(value, () => null) : this.getDefaultData()
    },
    closeDialog() {
      this.dialog.visible = false
      this.data = this.getDefaultData()
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.address-input{
  .address-display{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .address-display-left{
    width: 80%;
    width: calc(100% - 60px);
  }
  .address-line1{
    @include ellipsis;
    font-weight: bold;
  }
  .address-line2{
    @include ellipsis;
    font-size: .9em;
  }
  .address-line3{
    @include ellipsis;
    font-size: .9em;
    color: grey;
  }
  .edit-btn{
    margin: 0;
    .v-icon{
      color: grey;
    }
  }
}
</style>
