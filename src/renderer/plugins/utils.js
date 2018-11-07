import Vue from 'vue'
import * as hp from 'helper-js'
import storage from '@/plugins/storage'
import {getAxiosInstance} from '@/plugins/axios'

export function injectDependency (name, depd) {
  Vue[name] = Vue.prototype[`$${name}`] = depd
}
export function isISO8601(str) {
  // 2018-09-07T03:38:37.888Z
  return hp.isString(str) && str.match(/^\d{4}-\d{2}-\d{2}T/)
}
//
// must use vm as context
export function pullUser() {
  return this.$api.post('/user/current-user').then(data => {
    this.$store.state.user = data
    this.$store.state.authenticated = !data.isAnonymous
  })
}
// must use vm as context
export function keepAlive() {
  // refresh auth token per 20 minutes
  window.setInterval(() => {
    if (this.$store.state.authenticated) {
      this.$api.post('/user/keep-alive').then(data => {
        const axiosInstance = getAxiosInstance()
        axiosInstance.defaults.headers.common['Authorization'] = data.token
      })
    }
  }, 1000 * 60 * 20)
  // refresh user per 5 minutes
  window.setInterval(() => {
    pullUser.call(this)
  }, 1000 * 60 * 5)
}
// must use vm as context
export function logout() {
  const axiosInstance = getAxiosInstance()
  delete axiosInstance.defaults.headers.common['Authorization']
  this.$store.state.authenticated = false
  this.$store.state.user = {}
}
// must use vm as context
export function getPrinterSupport(type, value) {
  const optionsInfo = this.$store.state.printerFilterInfo
  if (type === 'size') {
    return value.map(v => optionsInfo[type].find(v2 => v2.value === v).text).join(', ')
  } else {
    let value2
    if (type === 'color') {
      value2 = value.includes('color') ? 'color' : 'b/w'
    } else {
      value2 = value.includes('double') ? 'double' : 'single'
    }
    return optionsInfo[type].find(v2 => v2.value === value2).text
  }
}
// must use vm as context
export function calcPrice(price) {
  price = parseFloat(price.toFixed(3))
  let commission = this.$store.state.order.commission * price
  commission = parseFloat(commission.toFixed(3))
  return [price, commission]
}

export function priceAdd(m1, m2) {
  let r = parseFloat(m1.toFixed(3)) + parseFloat(m2.toFixed(3))
  return parseFloat(r.toFixed(3))
}

export function pdfOptionPageNumberText(pages, totalPages) {
  if (totalPages != null && pages.length === totalPages) {
    return 'All pages'
  }
  const groups = []
  let last // last group
  for (const page of pages) {
    if (!last) {
      last = []
      groups.push(last)
    }
    if (last.length === 0 || page - hp.arrayLast(last) === 1) {
      last.push(page)
    } else {
      last = [page]
      groups.push(last)
    }
  }
  const arr = groups.map(group => group.length === 1 ? group[0] : `${group[0]} - ${hp.arrayLast(group)}`)
  return arr.join(', ')
}
