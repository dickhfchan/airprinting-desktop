<template lang="pug">
.payment-page.pa-2(v-if="data")
  v-card.pa-2
    v-card-title.py-1(primary-title)
      h4.card-title Order Summary
    v-card-text.py-1
      div
        .file-area(v-for="pdf in data.pdfs")
          .filename-row
            .filename {{pdf.name}}
            .price.ml-1 ${{priceAdd(pdf.price, pdf.commission)}}
          .options
            .options-row(v-for="opt in pdf.options")
              .options-text
                .options-pages Pages: {{pdfOptionsPageText(opt)}}
                .options-info {{optText(opt)}}
              .price ${{priceAdd(opt.price, opt.commission)}}
    v-card-title.py-1.total-area(primary-title)
      h4.card-title Total
      .price ${{totalPrice}}
  v-card.pa-2.mt-2
    v-card-title.py-1.flex-space-between(primary-title)
      h4.card-title Your balance:
      .price ${{$store.state.user.balance}}
  v-btn(color="accent" block :disabled="$store.state.user.balance<totalPrice" @click="pay" :loading="paying") Pay with balance
  v-btn(color="primary" block @click="rechargeVisible=true") Recharge
  RechargeDialog(v-model="rechargeVisible")
</template>

<script>
import * as ut from '@/plugins/utils'
import RechargeDialog from '@/components/RechargeDialog.vue'

export default {
  components: {RechargeDialog},
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    this.$confirm('Are you sure to leave the payment?').then(() => {
      next()
    }, () => {
      next(false)
    })
  },
  data() {
    return {
      id: this.$route.query.id, // order id
      data: null, // order
      rechargeVisible: false,
      paying: false,
    }
  },
  computed: {
    totalPrice() {
      return this.priceAdd(this.data.price, this.data.commission)
    },
  },
  // watch: {},
  methods: {
    async pull() {
      const data = await this.$api.post('order/select', {id: this.id})
      const printer = await this.$api.post('printer/select', {id: data.printerId})
      this.data = data
    },
    priceAdd(a, b) {
      return ut.priceAdd(a, b)
    },
    optText(opt) {
      let t = ['size', 'color', 'side'].map(type => {
        return this.$store.state.printerFilterInfo[type].find(v => v.value === opt[type]).text
      })
      return `${t.join(',')}, x${opt.copies}`
    },
    pdfOptionsPageText(options) {
      return ut.pdfOptionPageNumberText(options.pages, this.data.pageCount)
    },
    async pay() {
      this.paying = true
      try {
        await this.$api.post('order/pay-with-balance', {id: this.id})
        await ut.pullUser.call(this)
        this.$notifySuccess('Paid successfully.')
        // todo
      } finally {
        this.paying = false
      }
    },
  },
  // created() {},
  async mounted() {
    this.$store.state.toolbar.title = 'Payment'
    await this.pull()
  },
}
</script>

<style lang="scss">
.payment-page{
  .flex-space-between{
    display: flex;
    justify-content: space-between;
  }
  .file-area:not(:last-child){
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  .filename-row{
    @extend .flex-space-between;
  }
  .filename{
    @include ellipsis;
    font-weight: bold;
    color: $accent;
    font-size: .9em;
  }
  .price{
    color: $accent;
    font-weight: bold;
  }
  .options{
    padding-left: 1em;
  }
  .options-row{
    @extend .flex-space-between;
    display: flex;
    align-items: center;
    font-size: .9em;
  }
  .options-text{
  }
  .options-pages{
    color: $primary;
  }
  .options-info{
    color: #666;
  }
  .card-title{
  }
  .total-area{
    @extend .flex-space-between;
    border-top: 1px solid #ccc;
  }
}
.payment-page-card{
}
</style>
