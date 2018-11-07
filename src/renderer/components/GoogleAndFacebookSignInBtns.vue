<template lang="pug">
.google-and-facebook-sign-in-btns
  GoogleSignin(@success="googleLogin")
    .openid-btn.singin-with-google-btn.elevation-2
      img.openid-icon.google-icon(src="~@/assets/img/google-icon.png")
      span Sign in with Google
  FacebookSignin.mt-2(@success="facebookLogin")
    .openid-btn.singin-with-facebook-btn.elevation-2
      img.openid-icon(src="~@/assets/img/web-Facebook.png")
      span Sign in with Facebook
</template>

<script>
import GoogleSignin from '@/components/GoogleSignin'
import FacebookSignin from '@/components/FacebookSignin'
import * as ut from '@/plugins/utils'
import {getAxiosInstance} from '@/plugins/axios'
import storage from '@/plugins/storage'

export default {
  components: {GoogleSignin, FacebookSignin},
  props: {
    value: {},
  },
  data() {
    return {}
  },
  computed: {
  },
  // watch: {},
  methods: {
    async googleLogin(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      const data = await this.$api.post(`/google/login-or-register`, {token})
      this.afterLogin(data)
    },
    async facebookLogin(facebookUser, response) {
      const token = response.authResponse.accessToken
      const data = await this.$api.post(`/facebook/login-or-register`, {token, id: facebookUser.id})
      this.afterLogin(data)
    },
    async afterLogin(data) {
      storage.set('auth_token', data.token, 60)
      const axiosInstance = getAxiosInstance()
      axiosInstance.defaults.headers.common['Authorization'] = data.token
      await ut.pullUser.call(this)
      this.$notifySuccess(`Logined Successfully`)
      this.$emit('success')

    },
  },
  // created() {},
  // mounted() {},
}
</script>

<style lang="scss">
.google-and-facebook-sign-in-btns{
}
.openid-btn{
  cursor: pointer;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 1.2em;
  border-radius: 5px;
}
.openid-icon{
  width: 30px;
  margin-right: 20px;
}
.singin-with-google-btn{
  background-color: #DF4B38;
  color: #fff;
}
.singin-with-facebook-btn{
  background-color: #3b66c4;
  color: #fff;
}
</style>
