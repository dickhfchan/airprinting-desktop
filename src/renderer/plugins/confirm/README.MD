## Install
```js
Vue.use(confirm)
// or
Vue.use(confirm, {
  // if this changed, you need use this.$your instead of this.$confirm
  property: 'confirm',
  // default values
  message: 'Are you sure?',
  title: 'Confirm',
  maxWidth: 390,
  persistent: true,
})
```
## usage
```js
// the returned result is promise
// in vue component
this.$confirm(message, title, options)
// outside of vue component
Vue.confirm(...)
/*
message, optional, default: 'Are you sure?'
title, optional, default: 'Confirm'
options, optional, default: {
  message: 'Are you sure?',
  title: 'Confirm',
  maxWidth: 390,
  persistent: true,
}
*/
this.$confirm('Are you sure you want to delete?')
// or
this.$confirm('Are you sure you want to delete?', 'Custom Title')
// or
this.$confirm('Are you sure you want to delete?', 'Custom Title', {
  maxWidth: 666,
  persistent: false,
})
// or
this.$confirm({
  message: 'Are you sure you want to delete?',
  title: 'Custom Title',
})
```
