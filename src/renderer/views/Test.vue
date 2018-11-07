<template lang="pug">
v-container(fluid='')
  v-btn(color='primary' @click="$alert('hello')") alert
  v-btn(color='primary' @click="$confirm()") Confirm
  hr.my-3
  b.mr-2 Notifications:
  v-btn(color='success' @click="$notifySuccess()") Success
  v-btn(color='error' @click="$notifyError()") Error
  v-btn(color='warning' @click="$notifyWarn()") Warning
  v-btn(color='info' @click="$notifyInfo()") Info
  hr.my-3
  b.mr-2 Auth:
  span(v-if="!$store.state.authenticated") Guest
  template(v-else)
    span Name: {{$store.state.user.name}} | Email: {{$store.state.user.email}}
    v-btn(color='warning' @click="logout()" small) Logout
    GoogleSignin(@success="googleLink")
      v-btn(color='info' small) Link Google
    FacebookSignin(@success="facebookLink")
      v-btn(color='info' small) Link Facebook
  .mb-3
  Row
    Col(:width="0.5")
      form(@submit.prevent="register")
        v-text-field(v-model="email", label='E-mail', required)
        v-text-field(v-model="name", label='Name', required)
        v-text-field(v-model="password", label='Pasword', required type="password")
        GoogleRecaptcha(ref="recaptchaRegister")
        v-btn.ma-0(type="submit") Register
    Col(:width="0.5")
      form(@submit.prevent="login")
        v-text-field(v-model="email", label='E-mail', required)
        v-text-field(v-model="password", label='Pasword', required type="password")
        GoogleRecaptcha(ref="recaptchaLogin")
        v-btn.ma-0(type="submit") Login
  hr.my-3
  div
    b.mr-2 Google:
    GoogleSignin(@success="googleLogin")
      v-btn(color='info') Sign in
    GoogleSignin(@success="googleRegister")
      v-btn(color='info') Sign Up
  div
    b.mr-2 Facebook:
    FacebookSignin(@success="facebookLogin")
      v-btn(color='info') Sign in
    FacebookSignin(@success="facebookRegister")
      v-btn(color='info') Sign Up
</template>

<script>
import GoogleRecaptcha from '@/components/GoogleRecaptcha'
import GoogleSignin from '@/components/GoogleSignin'
import FacebookSignin from '@/components/FacebookSignin'

export default {
  components: {GoogleRecaptcha, GoogleSignin, FacebookSignin},
  data() {
    return {
      email: '1@test.com',
      name: 'test1',
      password: '123',
    }
  },
  methods: {
    async register() {
      const recaptcha = this.$refs.recaptchaRegister
      const token = await recaptcha.getToken()
      const requestData = {
        email: this.email,
        name: this.name,
        password: this.password,
      }
      requestData.recaptcha = token
      await this.$api.post('/user/register', requestData)
      await this.pullUser()
      this.$notifySuccess(`Registered Successfully`)
    },
    async login() {
      const recaptcha = this.$refs.recaptchaLogin
      const token = await recaptcha.getToken()
      const requestData = {
        email: this.email,
        password: this.password,
      }
      requestData.recaptcha = token
      await this.$api.post('/user/login', requestData)
      await this.pullUser()
      this.$notifySuccess(`Logined Successfully`)
    },
    async logout() {
      await this.$api.post('/user/logout')
      await this.pullUser()
      this.$notifySuccess(`Logout Successfully`)
    },
    pullUser() {
      return this.$api.post('/user/current-user').then(data => {
        this.$store.state.user = data
        this.$store.state.authenticated = !data.isAnonymous
      })
    },
    //
    async googleLogin(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      const data = await this.$api.post(`/google/login`, {token})
      await this.pullUser()
      this.$notifySuccess(`Logined Successfully`)
    },
    async googleRegister(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      const data = await this.$api.post(`/google/register`, {token})
      await this.pullUser()
      this.$notifySuccess(`Registered Successfully`)
    },
    async googleLink(googleUser) {
      const token = googleUser.getAuthResponse().id_token
      const data = await this.$api.post(`/google/link`, {token})
      await this.pullUser()
      this.$notifySuccess(`Linked Successfully`)
    },
    facebookLogin(user) {
      console.log(user);
    },
    facebookRegister() {},
    facebookLink() {},
  },
  mounted() {
    this.pullUser()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.GoogleSignin, .FacebookSignin{
  display: inline-block;
}
</style>
