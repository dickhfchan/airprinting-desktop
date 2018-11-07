<template lang="pug">
.FacebookSignin(@click="click")
  slot
  //- fb:login-button(scope='public_profile,email', onlogin='checkLoginState();')
</template>

<script>
import thirdApiInitialization from './thirdApiInitialization'

export default {
  extends: thirdApiInitialization,
  // components: {},
  props: {
    appId: {},
    params: {
      type: Object,
      default: is => ({
        scope: 'email',
      }),
    },
  },
  data() {
    return {
      apiLoadedCallbackName: 'fbAsyncInit',
      apiUrl: `https://connect.facebook.net/en_US/sdk.js`,
    }
  },
  // computed: {},
  // watch: {},
  methods: {
    afterApiLoaded() {
      const {FB} = window
      FB.init({
        appId      : this.appId || this.$store.state.facebookSignin.appId,
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });

      FB.AppEvents.logPageView();
      return Promise.resolve(FB)
    },
    click() {
      this.readyPromise.then(FB => {
        FB.login(response => {
          if (response.authResponse) {
            FB.api('/me', {fields: 'name, email'},facebookUser => {
              // facebookUser example
              /*
              {
                "name": "xxx",
                "email": "xxx@outlook.com",
                "id": "2648xxxx435xxxx"
              }
               */
              // response example
              /*
              {
                "authResponse": {
                  "accessToken": "EAAXgEHNC9qsBAPiD8mmXh9zNY01wEwZC4JlAqs37XbdGGPT2WMhW0ZCpIgCJWpB98iywM0E72v6I9h9AuUQwQCG89Ch0o7t9nBaA90uBVIixjPt7GCChDnLKISBJlzm7G2YAvaALOcbK02azZARsh9gAZAUFCRrEpZBZAduDC4LyTTMFZACZCbBRi6X3CrkNjWwPQFZCfxxxxxxxxx",
                  "userID": "2648xxxx435xxxx",
                  "expiresIn": 5286,
                  "signedRequest": "_CRr6tEhyQ0n3qisV-bcp4ApNSVr65SyJ-itW6dPa4U.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUNUbG1TOHFEbkxJUnVDVm15SEFDUEFQU1JnRkZpSkRXN1pBWk9XczZBM3B3WkR0R3NUU0JqNkJndVZpMmVWTlpZTmR6b2ZZM1hjYzNvMkJwQWNpdFBGVlh1Q0xzQ1drejJaN3A1Rm5yeFUyazRzSmhHQnFQUmVvMzlsNGphNFlyUzN1QlRZNWQ5eEJpS0dmUVYzUG02RmZRYm1HOEowNHpONEsxVG9RaDZzN3dFeXhBek5jdVNLWVBEVW4wRUw4VXVwRHgzMUNtUlItdFVjLUM3eHNZTGE2WWpiUlJNWUs4R2t2OVllMHpVWmltNDZfa2d4WUFsdTFnT3BJZWI2TTlaRnFIaU9STWFZanNRYkh4VEhBd1cwRG1lbGYtLTBVRWZ0b2JCamdLNnJTSUxwbTNtbnk3SlNVUXBTZllPQ2tRbThuVW9HUTFLY2NmSmFDbGUwZmZjbiIsImlzc3VlZF9hdCI6MTUzODI5MjcxNCwidXNlcl9pZCI6IjI2NDgxNjQ4NDxxxxxxxxxx",
                  "reauthorize_required_in": 7776000
                },
                "status": "connected"
              }
               */
              this.$emit('success', facebookUser, response)
            })
          } else {
            this.$emit('error', response)
          }
        }, this.params)
      })
    },
    logout() {
      this.readyPromise.then(FB => {
        FB.logout()
      })
    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.FacebookSignin{}
</style>
