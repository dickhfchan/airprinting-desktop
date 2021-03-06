<template lang="pug">
.printer-form
  v-dialog(v-model="visible", max-width='800px')
    v-card.printer-form-card(v-if="visible && pulled")
      v-card-title
        .headline {{mode === 'edit' ? 'Edit' : 'Add'}} printer
      v-card-text
        v-select(:items="connectedPrinters" item-text="name" item-value="name" v-model="data.name" placeholder="Connected Printer" hide-details)
        .subheading.red--text(v-if="connectedPrinters.length === 0") There is not any printer connected to the computer.
        .printer-info
          .line
            .label Name:
            .value {{data.name}}
          .line
            .label Model no:
            .value {{data.modelNo}}
          .line
            .label Color:
            .value
              v-icon.ml-1(:class="(supportColor?'success':'warning')+'--text'") {{supportColor?'check_circle':'error'}}
          .line
            .label Duplex:
            .value
              v-icon.ml-1(:class="(supportDuplex?'success':'warning')+'--text'") {{supportDuplex?'check_circle':'error'}}
          .line
            .label Paper size:
            .value {{sizeText}}
        br
        AddressInput(v-model="data.address" ref="addressInput")
        hr.mt-1
        .mt-3
        .subheading Price(per side, min {{$store.state.order.minPricePerSide}})
        .price-list
          .price-row.flex-sb-c(v-for="row in data.prices")
            .price-row-left {{priceText(row)}}
            .price-input
              v-text-field(prefix="$" type="number" hide-details single-line v-model="row.price" :min="$store.state.order.minPricePerSide")
        //- opening hours
        .subheading Opening hours
        v-radio-group.pt-1(v-model="data.openingHoursType" hide-details)
          v-radio(label="Allow request while I am online" value="online")
          v-radio(label="Allow request in time period" value="period")
        .mt-1(v-if="data.openingHoursType === 'period'")
            h4.time-periods-title Time periods
            table.time-period-table.mt-1(v-if="data.openingHours.length > 0")
              tr
                th Days
                th.col-from From
                th.col-to To
                th.col-action
              tr(v-for="row in data.openingHours")
                td {{row.days | daysText}}
                td {{row.from}}
                td {{row.to}}
                td
                  v-icon.period-remove-btn(@click="removePeriod(row)") close
            span.error--text(v-else) No time periods.
            div
              v-btn.ml-0(color="accent" @click="addPeriod") Add time period
            v-checkbox(label='Close on public holiday' v-model='data.closeOnHoliday')
        //-
        .mt-2
        .subheading Status
        v-radio-group.pt-1(v-model="data.suspended" hide-details)
          v-radio(label="Open" :value="false")
          v-radio(label="Suspended" :value="true")
        v-btn.mt-3(color="accent" block @click="save") Save
  //- add period dialog =================================
  v-dialog(v-model="apDialog.visible" hide-overlay='', transition='dialog-bottom-transition', scrollable :width="500")
    v-card.add-time-period-card(tile='' v-if="apDialog.visible")
      v-toolbar(dark color='accent')
        v-btn(icon dark @click.native="apDialog.visible=false")
          v-icon close
        v-toolbar-title
          span Add Time Period
      v-card-text
        .form-line
          .form-label Days
          .weekday-checkboxes
            .weekday-checkbox(v-for="item in weekdayItems")
              v-checkbox(v-model="item.checked" :label="item.text")
        .title Time(eg: 09:30. min: 00:00. max: 23:59)
        v-text-field.mt-0(v-model="apDialog.from" placeholder="From")
        v-text-field.mt-1(v-model="apDialog.to" placeholder="To")
        v-btn.mt-3(color="accent" block @click="saveTimePeriod") Save
</template>

<script>
import Printer from '@/printer/Printer.js'
import AddressInput from '@/components/AddressInput.vue'

export default {
  components: {AddressInput},
  props: {
    value: {},
  },
  data() {
    return {
      pulled: false,
      mode: 'edit',
      connectedPrinters: [],
      optionsInfo: this.$store.state.printerFilterInfo,
      data: null,
      // add period dialog
      apDialog: {
        visible: false,
        days: [],
        from: null,
        to: null,
      },
      weekdayItems: [
        {text: 'Mon', value: 1, checked: false},
        {text: 'Tue', value: 2, checked: false},
        {text: 'Wed', value: 3, checked: false},
        {text: 'Thu', value: 4, checked: false},
        {text: 'Fri', value: 5, checked: false},
        {text: 'Sat', value: 6, checked: false},
        {text: 'Sun', value: 0, checked: false},
      ],
    }
  },
  filters: {
    daysText(arr) {
      const dayTexts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return arr.map(n => dayTexts[n]).join(', ')
    },
  },
  computed: {
    visible: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },
    sizeText() {
      return this.data.size.map(v => this.optionsInfo.size.find(v2 => v2.value === v).text).join(', ')
    },
    supportColor() {
      return this.data.color.includes('color')
    },
    supportDuplex() {
      return this.data.side.includes('double')
    },
  },
  watch: {
    value: {
      async handler(value) {
        if (value) {
          this.$toast()
          await this.pull()
          this.$hideToast()
        }
      }
    },
    'data.name': {
      immediate: true,
      handler(name) {
        if (this.value && this.data) {
          this.printerChanged()
        }
      }
    }
  },
  methods: {
    async pull() {
      const getMime = this.$api.post('printer/mine')
      const getPrinters = Printer.getInstalledPrinters()
      const mime = await getMime
      this.connectedPrinters = await getPrinters
      this.mode = mime ? 'edit' : 'new'
      const data = mime || createPrinter()
      data.prices = data.prices || []
      if (!data.openingHours) {
        data.openingHours = []
      }
      this.data = data
      this.pulled = true
      function createPrinter() {
        return {
          "side": [],
          "size": [],
          "model_no": null,
          "closeOnHoliday": false,
          "name": null,
          "opening_hours": null,
          "prices": null,
          "address": null,
          "suspended": false,
          "openingHoursType": "online",
          "color": []
        }
      }
    },
    printerChanged() {
      const name = this.data.name
      const printer = this.connectedPrinters.find(v => v.name === name)
      if (name) {
        this.data.size = printer.sizes.map(v => v.toLowerCase()).filter(v => ['a3', 'a4'].includes(v))
        this.data.color = printer.color ? ['b/w', 'color'] : ['b/w'],
        this.data.side = printer.duplex ? ['single', 'double'] : ['single']
      } else {
        Object.assign(this.data, {
          color: [],
          size: [],
          side: [],
        })
      }
      this.generatePrices()
    },
    generatePrices() {
      const colors = this.data.color
      const sides = this.data.side
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
    addPeriod() {
      this.weekdayItems.forEach(row => {
        row.checked = false
      })
      Object.assign(this.apDialog, {
        visible: true,
        from: null,
        to: null,
      })
    },
    removePeriod(row) {
      hp.arrayRemove(this.data.openingHours, row)
    },
    saveTimePeriod() {
      // validate
      const days = this.weekdayItems.filter(v => v.checked)
      .map(day => day.value)
      const {from, to} = this.apDialog
      if (days.length === 0) {
        this.$alert('The days is required.')
        return
      }
      if (!from || !to) {
        this.$alert('The time is required.')
        return
      }
      const validateTime = (hhmm) => {
        if (!hhmm.match(/^\d{1,2}:\d{1,2}$/)) {
          return false
        }
        const [h, m] = hhmm.split(':')
        if (h > 23 || m > 59) {
          return false
        }
        return true
      }
      if (!validateTime(from) || !validateTime(to)) {
        this.$alert('The format of time is invalid.')
        return
      }
      if (compareTime(from, to) > 0) {
        this.$alert('The end time must be later than the start time.')
        return
      }
      //
      this.data.openingHours.push({days, from, to})
      this.apDialog.visible = false
    },
    async save() {
      try {
        // validate
        if (!this.data.name) {
          this.$alert('Please select a connected printer.')
          return
        }
        const addressValidateResult = this.$refs.addressInput.validate()
        if (addressValidateResult) {
          this.$alert(`Invalid address. ${addressValidateResult}`)
          return
        }
        if (!this.data.size.length === 0) {
          this.$alert('The printer don\'t support A3 or A4.')
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
        // validate opening hours
        if (data.openingHoursType === 'period' && data.openingHours.length === 0) {
          this.$alert('The time period is required.')
          return
        }
        this.$toast()
        if (this.mode === 'add') {
          await this.$api.post('printer/store', data)
        } else {
          await this.$api.post('printer/update', data)
        }
        this.$notifySuccess('Saved successfully.')
        this.$emit('saved')
        this.visible = false
      } finally {
        this.$hideToast()
      }
    },
  },
  // created() {},
  async mounted() {
    this.$store.state.toolbar.title = 'Printer Basic Info'
    await this.pull()
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
function compareTime(hhmm1, hhmm2) {
  const [h1, m1] = hhmm1.split(':')
  const [h2, m2] = hhmm2.split(':')
  return (h1 * 60 + m1) - (h2 * 60 + m2)
}
</script>

<style lang="scss">
.printer-form-card{
  .printer-info{
    font-size: 16px;
    line-height: 30px;
    .line{
      display: flex;
      align-items: center;
    }
    .label{
      font-weight: bold;
    }
    .value{
      margin-left: .5em;
    }
  }
  .price-list{
    border: 1px solid $secondary;
    padding: 5px 10px;
    margin: 10px 0;
  }
  .price-row-left{
  }
  .price-input{
    width: 82px;
    position: relative;
    top: -10px;
    .v-input{
      margin-top: 0px;
      padding-top: 5px;
    }
  }
  .add-btn{
    margin: 0;
    width: auto;
    &:focus:before {
      background-color: none;
    }
  }
  // time-period-table ============
  .time-period-table{
    width: 300px;
    line-height: 25px;
    color: $primary;
    th{
      font-weight: 400;
      color: $secondary;
      text-align: left;
    }
    td{
      vertical-align: middle;
    }
  }
  .col-from{
    width: 80px;
  }
  .col-to{
    width: 50px;
  }
  .col-action{
    width: 20px;
  }
  .period-remove-btn{
    cursor: pointer;
    font-size: 20px;
    color: #ef6161;
  }
  // time-period-table ============
}
.add-time-period-card{
  .weekday-checkbox{
    display: inline-block;
    width: 80px;
  }
}
</style>
