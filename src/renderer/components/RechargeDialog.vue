<template lang="pug">
v-dialog.recharge-dialog(v-model="visible", fullscreen='', hide-overlay='', transition='dialog-bottom-transition')
  v-card.recharge-card
    v-toolbar.toolbar-style1(dark='', color='accent' dense)
      v-toolbar-title
        v-btn.toolbar-icon-btn-style1(icon='', dark='', @click.native='visible = false')
          v-icon close
        span Recharge
    v-card-text
      .flex-sb-c.my-2
        h3 Your balance:
        .price ${{$store.state.user.balance}}
      .help-text.mt-3 Adding credits to your account, needs to be a minimum of HK$ 50 each time. Please type in the amount you like to add.
      v-layout(align-center)
        .input-label Amount:
        v-text-field.ml-2(type="number" v-model="amount" single-line hide-details)
      .mt-3
      div
        b Pay method
      v-layout(align-center)
        .pay-method-option
          Radio(v-model="payMethod" value2="stripe")
            img.pay-method-img.pmi-stripe(src="~@/assets/img/stripe-logo-blue.png")
        .pay-method-option.ml-3
          Radio(v-model="payMethod" value2="fps")
            img.pay-method-img.pmi-fps(src="~@/assets/img/fps-logo.png")
      v-btn.mt-3(color="accent" block :loading="loading" @click="next") Proceed to recharge
</template>

<script>
import * as ut from '@/plugins/utils'
import Radio from '@/components/Radio.vue'
import $script from 'scriptjs'
import logo from '@/assets/img-export/3x/printer.png'

export default {
  components: {Radio},
  props: {
    value: {},
  },
  data() {
    return {
      amount: 50,
      payMethod: 'stripe',
      loading: false,
    }
  },
  computed: {
    visible: {
      get() { return this.value },
      set(value) { this.$emit('input', value) },
    },
    amountStripe() { return this.amount * 100 },
  },
  // watch: {},
  methods: {
    next() {
      if (this.amount < 50) {
        this.$alert('The minimum recharge amount is HK$ 50.')
        return
      }
      const decimalPlaces = this.amount.toString().split('.')[1]
      if (decimalPlaces && decimalPlaces.length > 2) {
        this.$alert('The amount only allows up to two decimals.')
        return
      }
      this.loading = true
      if (this.payMethod === 'stripe') {
        $script('https://checkout.stripe.com/checkout.js', () => {
          const {StripeCheckout} = window
          const handler = StripeCheckout.configure({
            key: this.$store.state.stripe.publishedKey,
            image: logo,
            locale: 'auto',
            token: async (token, ...args) => {
              // You can access the token ID with `token.id`.
              // Get the token ID to your server-side code for use.
              await this.$api.post('payment/stripe', {
                token: token.id,
                amount: this.amountStripe,
              })
              await ut.pullUser.call(this)
              this.loading = false
              this.$notifySuccess('Recharge successful.')
            }
          })
          handler.open({
            name: this.$store.state.siteName,
            description: this.$store.state.siteDescription,
            zipCode: true,
            currency: this.$store.state.payment.currency.toUpperCase(),
            amount: this.amountStripe,
            opened: () => {},
          })
        })
      }
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.recharge-dialog{
}
.recharge-card{
  .price{
    color: $accent;
    font-weight: bold;
  }
  .help-text{
    color: $secondary;
    font-size: 1.1em;
  }
  .input-label{
    position: relative;
    bottom: -10px;
    font-weight: bold;
  }
  .pay-method-img{
    vertical-align: middle;
  }
  .pmi-stripe{
    width: 120px;
  }
  .pmi-fps{
    width: 80px;
    margin-left: 10px;
  }
}
</style>
