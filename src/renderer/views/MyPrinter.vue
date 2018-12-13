<template lang="pug">
.my-printer-page
  .headline(v-if="!printer")
    span You have not configured a printer yet.
    v-btn.ml-3(color="accent" @click="editMyPrinter") Configure
  v-card(v-else)
    v-card-title
      .title My printer info
      v-btn(color="accent" small @click="editMyPrinter") edit
    v-card-text
      .printer-info
        .line
          .label Name:
          .value {{printer.name}}
        .line
          .label Model no:
          .value {{printer.modelNo}}
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
      AddressInput(v-model="printer.address" :readonly="true" ref="addressInput")
      hr.mt-1
      .mt-3
      .subheading
        b Price(per side)
      v-list.price-list(dense='')
        v-list-tile(v-for="(row, i) in printer.prices" :key="i")
          v-list-tile-content
            b {{priceText(row)}}
          v-list-tile-content.align-end ${{row.price}}
      .subheading
        b Opening hours
      b Type:
      span.ml-2
        span(v-if="printer.openingHoursType==='online'") Allow request while I am online
        span(v-else) Allow request in time period
      .mt-1(v-if="printer.openingHoursType === 'period'")
          h4.time-periods-title Time periods
          table.time-period-table.mt-1(v-if="printer.openingHours.length > 0")
            tr
              th Days
              th.col-from From
              th.col-to To
            tr(v-for="row in printer.openingHours")
              td {{row.days | daysText}}
              td {{row.from}}
              td {{row.to}}
          span.error--text(v-else) No time periods.
      .mt-1.caption(v-if="printer.closeOnHoliday")
        b Close on public holiday
      .subheading.mt-1
        b Suspended:
        span  {{printer.suspended ? 'Yes' : 'No'}}
  PrinterForm(v-model="printerForm.visible" @saved="pull")
</template>

<script>
import PrinterForm  from '@/dialogs/PrinterForm.vue'
import AddressInput from '@/components/AddressInput.vue'

export default {
  components: {PrinterForm, AddressInput},
  data() {
    return {
      optionsInfo: this.$store.state.printerFilterInfo,
      printer: null,
      printerForm: {
        visible: false,
      },
    }
  },
  filters: {
    daysText(arr) {
      const dayTexts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return arr.map(n => dayTexts[n]).join(', ')
    },
  },
  computed: {
    sizeText() {
      return this.printer.size.map(v => this.optionsInfo.size.find(v2 => v2.value === v).text).join(', ')
    },
    supportColor() {
      return this.printer.color.includes('color')
    },
    supportDuplex() {
      return this.printer.side.includes('double')
    },
  },
  // watch: {},
  methods: {
    async pull() {
      this.printer = await this.$api.post('printer/mine')
    },
    async editMyPrinter() {
      this.printerForm.visible = true
    },
    priceText(row) {
      return ['size', 'color', 'side'].map(key => this.optionsInfo[key].find(v => v.value === row[key]).text).join(', ')
    },
  },
  // created() {},
  mounted() {
    this.pull()
  },
}
</script>

<style lang="scss">
.my-printer-page{
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
    max-width: 150px;
    .list__tile{
      padding: 0;
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
  // time-period-table ============
}
</style>
