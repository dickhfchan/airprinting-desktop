based on [vuetify dialog](https://vuetifyjs.com/zh-Hans/components/dialogs)
## Install
```js
Vue.use(alert)
// or
Vue.use(alert, {
  // if this changed, you need use this.$your instead of this.$alert
  property: 'alert',
  // default values
  message: 'Something wrong!',
  title: 'Oops!',
  maxWidth: 390,
  persistent: true,
})
```
## usage
```js
// the returned result is promise
// in vue component
this.$alert(message, title, options)
// outside of vue component
Vue.alert(...)
/*
message, optional, default: 'Something wrong!'
title, optional, default: 'Oops!'
options, optional, default: {
  message: 'Something wrong!',
  title: 'Oops!',
  maxWidth: 390,
  persistent: true,
}
*/
this.$alert('Failed to submit!')
// or
this.$alert('Failed to submit!', 'Custom Title')
// or
this.$alert('Failed to submit!', 'Custom Title', {
  maxWidth: 666,
  persistent: false,
})
// or
this.$alert({
  message: 'Failed to submit!',
  title: 'Custom Title',
})
```
