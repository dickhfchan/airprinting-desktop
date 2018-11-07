<template lang="pug">
.printer-basic-info-page.pa-2
  v-card
    v-card-text
      AddressInput(v-model="data.address" ref="addressInput")
      hr.mt-1
      v-select(label="Printer model no." v-model="data.modelNo" :items="['example model no']")
      v-layout(align-center)
        v-flex(xs4)
          b.paper-size-label Paper size:
        v-flex(xs3
          v-for="item in optionsInfo.size" :key="item.value"
        )
          v-checkbox.mt-0(:label="item.text" v-model="data.size" :value="item.value" hide-details)
      v-checkbox(label="Support color printing", v-model="data.color" hide-details)
      v-checkbox(label="Supports duplex printing", v-model="data.double" hide-details)
      .mt-3
      h3 Price(per side)
      .price-list
        .price-row.flex-sb-c(v-for="row in data.prices")
          .price-row-left {{priceText(row)}}
          .price-input
            v-text-field(type="number" hide-details single-line v-model="row.price" :min="$store.state.order.minPricePerSide")
      v-btn.mt-3(color="accent" block @click="save") Save
</template>

<script>
import AddressInput from '@/components/AddressInput.vue'

export default {
  components: {AddressInput},
  data() {
    return {
      optionsInfo: this.$store.state.printerFilterInfo,
      data: {
        address: null,
        modelNo: null,
        size: [],
        color: false,
        double: false,
        prices: [],
      },
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    async pull() {
      let data = await this.$api.post('printer/mine')
      data = Object.assign({}, data)
      data.prices = data.prices || []
      data.color = data.color.includes('color')
      data.double = data.side.includes('double')
      delete data.side
      this.data = data
    },
    generatePrices() {
      const colors = ['b/w']
      if (this.data.color) {
        colors.push('color')
      }
      const sides = ['single']
      if (this.data.double) {
        sides.push('double')
      }
      const combinations = arrMultiply([this.data.size, colors, sides])
      const prices = combinations.map(com => {
        const old = this.data.prices.find(v => v.size === com[0] && v.color === com[1] && v.side === com[2])
        return {
          size: com[0],
          color: com[1],
          side: com[2],
          price: old ? old.price : null
        }
      })
      this.data.prices = prices
    },
    priceText(row) {
      return ['size', 'color', 'side'].map(key => this.optionsInfo[key].find(v => v.value === row[key]).text).join(', ')
    },
    async save() {
      if (!this.$refs.addressInput.hasValue) {
        this.$alert('Address is required.')
        return
      }
      if (!this.data.modelNo) {
        this.$alert('Printer model no. is required.')
        return
      }
      if (!this.data.size.length === 0) {
        this.$alert('Paper size is required.')
        return
      }
      if (this.data.prices.find(v => !v.price)) {
        this.$alert('Price is invalid.')
        return
      }
      const data = Object.assign({}, this.data)
      data.color = ['b/w']
      if (this.data.color) {
        data.color.push('color')
      }
      data.side = ['single']
      delete data.double
      if (this.data.double) {
        data.side.push('double')
      }
      data.prices.forEach(item => {
        item.price = parseFloat(item.price)
      })
      await this.$api.post('printer/update-basic', data)
      this.$notifySuccess('Saved successfully.')
    },
  },
  // created() {},
  async mounted() {
    this.$store.state.toolbar.title = 'Printer Basic Info'
    await this.pull()
    this.$watch('data.size', this.generatePrices)
    this.$watch('data.color', this.generatePrices)
    this.$watch('data.double', this.generatePrices)
    this.generatePrices()
  },
}
function arrMultiply(arrays) {
  let r = arrays[0]
  for (let i = 1; i < arrays.length; i++) {
    r = multiply2Arr(r, arrays[i])
    if (i > 1) {
      r = r.map(v => [...v[0], v[1]])
    }
  }
  return r
}
function multiply2Arr(arr1, arr2) {
  const r = []
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      r.push([arr1[i], arr2[j]])
    }
  }
  return r
}
</script>

<style lang="scss">
.printer-basic-info-page{
  .price-list{
    border: 1px solid $secondary;
    padding: 5px 10px;
    margin: 10px 0;
  }
  .price-row-left{
  }
  .price-input{
    width: 42px;
    position: relative;
    top: -10px;
    .v-input{
      margin-top: 0px;
      padding-top: 5px;
    }
  }
  .paper-size-label{
    position: relative;
    top: 2px;
  }
}
</style>
