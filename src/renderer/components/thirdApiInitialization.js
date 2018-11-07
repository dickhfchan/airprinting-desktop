// for the third api which need to be initialize, such as google, facebook
import $script from 'scriptjs'

//
const storeOfLoadApi = []
function loadApi(url, callback, callbackName) {
  let ignoreCallback
  if (callbackName) {
    ignoreCallback = true
    window[callbackName] = (...args) => {
      return callback(...args)
    }
  } else if (url.includes('[callback]')) {
    ignoreCallback = true
    const store = storeOfLoadApi
    if (!store.includes(url)) {
      store.push(url)
    }
    const index = store.indexOf(url)
    const callbackName = `_loadApiCallback_${index}`
    url = url.replace('[callback]', callbackName)
    window[callbackName] = (...args) => {
      return callback(...args)
    }
  }
  $script(url, () => {
    if (!ignoreCallback) {
      callback()
    }
  })
}
//
const loadeds = {} // promises

export default {
  data() {
    return {
      ready: false,
      readyPromise: new Promise((resolve, reject) => {
        this.readyResolve = resolve
      }),
      // apiLoadedCallbackName
    }
  },
  // methods: {
  //   // execute once. the arguments are same with callback. its result will pass to readyPromise
  //   // can return promise
  //   afterApiLoaded(...args) { return args },
  // },
  mounted() {
    const {apiUrl} = this
    if (!loadeds[apiUrl]) {
      loadeds[apiUrl] = {}
      loadeds[apiUrl].promise = new Promise(function(resolve, reject) {
        loadeds[apiUrl].resolve = resolve
      })
    }
    loadApi(apiUrl, async (...args) =>  {
      let finalArgs = args
      if (this.afterApiLoaded) {
        finalArgs = await this.afterApiLoaded(...args).then((...args2) => args2)
      }
      return loadeds[apiUrl].resolve(...finalArgs)
    }, this.apiLoadedCallbackName)
    loadeds[apiUrl].promise.then((...args) => {
      this.ready = true
      this.$emit('ready')
      this.readyResolve(...args)
    })
  },
}
