import axios from 'axios'
import * as hp from 'helper-js'
import * as ut from '@/plugins/utils'
import * as httpUtils from '@/plugins/httpUtils'
import store from '@/store'

let axiosInstance
export default {
  install(Vue) {
    axiosInstance = axios.create({
      baseURL: store.state.api,
      timeout: 20000, // 20 seconds
      withCredentials: false, // use token auth
    })
    ut.injectDependency('http', axios)
    ut.injectDependency('api', axiosInstance)
    // Add a response interceptor
    axiosInstance.interceptors.response.use((response) => {
      // Do something with response data
      const data = handleResponse(response)
      return data
    }, (error) => {
      // Do something with response error
      this.onError && this.onError(error)
      return handleResponse(error.response, error);
    })
    function handleResponse(response, error) {
      let {data} = response || {}
      if (data) {
        data = httpUtils.resolveResponseData(data)
      }
      const pureData = data && data.data
      const {config} = error || response
      if (error && !error.response && error.message.match(/^timeout of \d+ms exceeded$/)) {
        doAlert('Request timed out')
        config.finally && config.finally(error)
        return Promise.reject(error)
      }
      if (error || data.result === 'failed') {
        const msg = httpUtils.resolveErrorHttpMessage(data, response, error)
        // show sign in dialog when get 401
        if (response.status === 401) {
          store.state.authenticated = false
          store.state.user = {}
          store.state.signInDialogVisible = true
        }
        doAlert(msg)
        config.finally && config.finally(pureData, error || data)
        return Promise.reject(error || data, pureData)
      } else {
        config.finally && config.finally(pureData)
        return pureData
      }
      // default alert method is notify
      function doAlert(msg) {
        let canAlert = true
        if (error && error.config.hasOwnProperty('alert')) {
          canAlert = error.config.alert
        }
        if (canAlert) {
          if (canAlert === 'alert') {
            Vue.alert(msg)
          } else {
            Vue.notifyError(msg)
          }
        }
      }
    }
    // don't use request interceptor to pretreat request data, because request data has been converted to string then.
    // override methods to pretreat request data
    // 不使用请求拦截器预处理请求数据, 因为那时请求数据已被转换成字符串
    // 重写方法来预处理数据
    ['post', 'put', 'patch'].forEach(name => {
      const old = axiosInstance[name]
      if (!old) {
        return
      }
      axiosInstance[name] = function (url, data, ...args) {
        return old.call(this, url, httpUtils.resolveRequestData(data), ...args)
      }
    })
  }
}

export function getAxiosInstance() {
  return axiosInstance
}
