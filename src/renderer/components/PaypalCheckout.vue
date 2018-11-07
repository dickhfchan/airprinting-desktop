<template lang="pug">
.PaypalCheckout(:id="id")
  slot
</template>

<script>
import thirdApiInitialization from './thirdApiInitialization'

export default {
  extends: thirdApiInitialization,
  props: {
    money: {},
    currency: {default: 'USD'},
  },
  // components: {},
  data() {
    return {
      apiUrl: `https://www.paypalobjects.com/api/checkout.js`,
      id: `paypal_checkout_${this._uid}`,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    afterApiLoaded() {
      const {paypal} = window
      return new Promise(function(resolve, reject) {
        resolve(paypal)
      });
    },
  },
  // created() {},
  mounted() {
    this.readyPromise.then(paypal => {
      // Render the PayPal button
      paypal.Button.render({
        // Set your environment
        env: 'sandbox', // sandbox | production

        // Specify the style of the button
        style: {
          layout: 'vertical',  // horizontal | vertical
          size:   'medium',    // medium | large | responsive
          shape:  'rect',      // pill | rect
          color:  'gold'       // gold | blue | silver | white | black
        },

        // Specify allowed and disallowed funding sources
        //
        // Options:
        // - paypal.FUNDING.CARD
        // - paypal.FUNDING.CREDIT
        // - paypal.FUNDING.ELV
        funding: {
          allowed: [
            paypal.FUNDING.CARD,
            paypal.FUNDING.CREDIT
          ],
          disallowed: []
        },

        // PayPal Client IDs - replace with your own
        // Create a PayPal app: https://developer.paypal.com/developer/applications/create
        client: {
          sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
          production: '<insert production client id>'
        },

        payment: (data, actions) => {
          return actions.payment.create({
            payment: {
              transactions: [
                {
                  amount: {
                    total: this.money,
                    currency: this.currency,
                  }
                }
              ]
            }
          });
        },

        onAuthorize: (data, actions) => {
          return actions.payment.execute()
            .then(() => {
              this.$emit('success')
            });
        }
      }, '#'+this.id);
    })
  },
}
</script>

<style lang="scss">
.PaypalCheckout{}
</style>
