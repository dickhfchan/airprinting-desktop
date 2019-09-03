import Vue from 'vue'
import * as hp from 'helper-js'
import storage from '@/plugins/storage'
import {getAxiosInstance} from '@/plugins/axios'
import io from 'socket.io-client'
import store from '../store'

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
        updateAuthToken(data.token)
      })
    }
  }, 1000 * 60 * 20)
  // refresh user per 5 minutes
  window.setInterval(() => {
    pullUser.call(this)
  }, 1000 * 60 * 5)
}

let sockets = []
export function getSocket(url) {
  const token = storage.get('auth_token')
  const socket = io(url, {
    transportOptions: {
      polling: {
        extraHeaders: {
          'Authorization': storage.get('auth_token'),
        }
      }
    }
  })
  sockets.push(socket)
  return socket
}
export function updateAuthToken(token) {
  storage.set('auth_token', token, 60)
  const axiosInstance = getAxiosInstance()
  axiosInstance.defaults.headers.common['Authorization'] = token
  // reconnect sockets
  sockets = sockets.filter(v => v.connected)
  sockets.forEach(socket => {
    socket.io.opts.transportOptions.polling.extraHeaders.Authorization = token
    socket.disconnect()
    socket.connect()
  })
}
// must use vm as context
export function logout() {
  storage.set('auth_token', null)
  const axiosInstance = getAxiosInstance()
  delete axiosInstance.defaults.headers.common['Authorization']
  this.$store.state.authenticated = false
  this.$store.state.user = {}
  //
  sockets.forEach(socket => {
    socket.disconnect()
  })
  sockets = []
}
// must use vm as context
export function getFileUrl(key) {
  const {region, bucketName} = this.$store.state.s3
  return `https://s3-${region}.amazonaws.com/${bucketName}/${key}`
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
export function calcPriceCommission(price) {
  const precision = store.state.order.pricePrecision
  price = parseFloat(price.toFixed(precision))
  let commission = this.$store.state.order.commission * price
  commission = parseFloat(commission.toFixed(precision))
  return [price, commission]
}

export function priceAdd(m1, m2) {
  const precision = store.state.order.pricePrecision
  let r = parseFloat(m1.toFixed(precision)) + parseFloat(m2.toFixed(precision))
  return parseFloat(r.toFixed(precision))
}

export function groupPages(pages) {
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
  return groups
}
export function pdfOptionPageNumberText(pages, totalPages) {
  if (totalPages != null && pages.length === totalPages) {
    return 'All pages'
  }
  const groups = groupPages(pages)
  const arr = groups.map(group => group.length === 1 ? group[0] : `${group[0]} - ${hp.arrayLast(group)}`)
  return arr.join(', ')
}
