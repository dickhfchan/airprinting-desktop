// refre: https://github.com/yariksav/vuetify-confirm/blob/master/index.js
import Alert from './Alert'
import * as hp from 'helper-js'

function Install (Vue, options = {}) {
  assignIfNotHas(options, {
    // default
    property: 'alert',
    message: 'Something wrong!',
    title: 'Oops!',
    maxWidth: 390,
    persistent: true,
  })
  const globalOptions = options
  const {property} = globalOptions
  function show(...args) {
    let [message, title, options] = hp.resolveArgsByType(args, [
      ['String', globalOptions.message],
      ['String', globalOptions.title],
      ['Object', {}]
    ])
    message = options.message || message
    title = options.title || title
    const options0 = options
    options = Object.assign({}, options0)
    assignIfNotHas(options, {
      maxWidth: globalOptions.maxWidth,
      persistent: globalOptions.persistent,
    })
    return new Promise((resolve, reject) => {
      const vm = new Vue(Alert)
      Object.assign(vm, {
        message,
        title,
        options,
        resolve,
        reject,
      })
      document.body.appendChild(vm.$mount().$el)
    })
  }
  Vue[property] = Vue.prototype[`$${property}`] = show
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Install)
}

export default Install

function assignIfNotHas(obj, obj2) {
  for (const key in obj2) {
    if (!obj.hasOwnProperty(key)) {
      obj[key] = obj2[key]
    }
  }
  return obj
}
