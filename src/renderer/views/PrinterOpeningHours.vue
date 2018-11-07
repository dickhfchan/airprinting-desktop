<template lang="pug">
.printer-opening-hours-page.pa-2
  v-card
    v-card-text
      v-radio-group(v-model="data.type")
        v-radio(label="Allow request while I am online" value="online")
        v-radio(label="Allow request in time period" value="period")
        div(v-if="data.type === 'period'")
          h4.mt-2.time-periods-title Time periods
          table.time-period-table.mt-1(v-if="data.periods.length > 0")
            tr
              th Day
              th.col-from From
              th.col-to To
              th.col-action
            tr(v-for="row in data.periods")
              td {{row.day | dayText}}
              td {{row.from | timeText}}
              td {{row.to | timeText}}
              td
                v-icon.period-remove-btn(@click="removePeriod(row)") close
          small(v-else) No time periods.
          div
            v-btn.add-btn(color="primary" icon flat :ripple="false" @click="addPeriod")
              v-icon() add
          v-checkbox(label='close on public holiday' v-model='data.closeOnHoliday')
      v-btn.mt-1(color="accent" block @click="save" :loading="saving") Save
  //- dialog =================================
  v-dialog(v-model="dialog.visible" fullscreen='', hide-overlay='', transition='dialog-bottom-transition', scrollable)
    v-card.add-time-period-card(tile='' v-if="dialog.visible")
      v-toolbar.toolbar-style1(dark color='primary' dense)
        v-toolbar-title
          v-btn.ma-0(icon dark @click.native="dialog.visible=false")
            v-icon close
          span Add Time Period
      v-card-text
        .form-line
          .form-label Days
          .weekday-select
            .weekday-item(v-for="item in weekdayItems"
              :class="{active: item.checked}"
              @click="item.checked=!item.checked"
            ) {{item.text}}
        TimeInput.mt-3(v-model="dialog.from" placeholder="From")
        TimeInput.mt-1(v-model="dialog.to" placeholder="To")
        v-btn.mt-3(color="accent" block @click="saveTimePeriod") Save
</template>

<script>
import * as hp from 'helper-js'
import TimeInput from '@/components/TimeInput.vue'

const dayTexts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export default {
  components: {TimeInput},
  data() {
    return {
      data: {
        type: 'period', // online/period
        periods: [],
        closeOnHoliday: false,
      },
      dialog: {
        visible: false,
        from: null,
        to: null,
      },
      weekdayItems: [
        {text: 'M', value: 1, checked: false},
        {text: 'T', value: 2, checked: false},
        {text: 'W', value: 3, checked: false},
        {text: 'T', value: 4, checked: false},
        {text: 'F', value: 5, checked: false},
        {text: 'S', value: 6, checked: false},
        {text: 'S', value: 0, checked: false},
      ],
      saving: false,
    }
  },
  filters: {
    dayText(n) {
      return dayTexts[n]
    },
    timeText(hour24) {
      return hour24
      // there is a bug when convert hour24 to hour12: 00:xx will be converted to 12:xx PM
      // let [h, m] = hour24.split(':')
      // let am = true
      // if (h === '00') {
      //   am = false
      //   h = 12
      // } else if (parseInt(h) > 12) {
      //   am = false
      //   h = h - 12
      // }
      // return `${hp.numPad(h, 2)}:${m} ${am ? 'A' : 'P'}M`
    },
  },
  // computed: {},
  // watch: {},
  methods: {
    async pull() {
      const data = await this.$api.post('printer/mine')
      this.data = {
        type: data.openingHoursType,
        periods: data.openingHours || [],
        closeOnHoliday: data.closeOnHoliday,
      }
    },
    addPeriod() {
      this.weekdayItems.forEach(row => {
        row.checked = false
      })
      Object.assign(this.dialog, {
        visible: true,
        from: null,
        to: null,
      })
    },
    removePeriod(row) {
      hp.arrayRemove(this.data.periods, row)
    },
    saveTimePeriod() {
      // validate
      const {from, to} = this.dialog
      if (!from || !to) {
        this.$alert('The time is required.')
        return
      }
      if (compareTime(from, to) > 0) {
        this.$alert('The end time must be later than the start time.')
        return
      }
      const add = this.weekdayItems.filter(v => v.checked)
      .map(day => ({day: day.value, from: from, to: to}))
      if (add.length === 0) {
        this.$alert('The day is required.')
        return
      }
      //
      this.data.periods.push(...add)
      this.dialog.visible = false
    },
    async save() {
      const data = {
        openingHoursType: this.data.type,
        openingHours: this.data.periods,
        closeOnHoliday: this.data.closeOnHoliday,
      }
      if (data.openingHoursType === 'period' && data.openingHours.length === 0) {
        this.$alert('The time period is required.')
        return
      }
      try {
        this.saving = true
        await this.$api.post('printer/update-opening-hours', data)
        this.$notifySuccess('Saved successfully.')
      } finally {
        this.saving = false
      }
    },
  },
  // created() {},
  async mounted() {
    this.$store.state.toolbar.title = 'Printer Opening Hours'
    await this.pull()
  },
}
function compareTime(hhmm1, hhmm2) {
  const [h1, m1] = hhmm1.split(':')
  const [h2, m2] = hhmm2.split(':')
  return (h1 * 60 + m1) - (h2 * 60 + m2)
}
</script>

<style lang="scss">
.printer-opening-hours-page{
  .time-periods-title{
    text-align: center;
    color: $primary;
  }
  .add-btn{
    margin: 0;
    width: auto;
    &:focus:before {
      background-color: none;
    }
  }
  .time-period-table{
    width: 100%;
    color: $primary;
    th{
      font-weight: 400;
      font-size: .8em;
      color: $secondary;
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
}
.add-time-period-card{
  .weekday-select{
  }
  .weekday-item{
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid $primary;
    color: $primary;
    &.active{
      background-color: $primary;
      color: #fff;
    }
  }
  .form-line{
    display: flex;
    align-items: center;
  }
  .form-label{
    width: 50px;
  }
}
</style>
