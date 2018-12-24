import * as hp from 'helper-js'
import * as ut from './utils'

export function resolveRequestData(requestData) {
  return hp.mapObjectTree(requestData, (value, key, parent) => {
    if (!parent) return
    // Date to toISOString
    if (value instanceof Date) {
      value = value.toISOString()
    }
    if (hp.isString(key)) {
      key = hp.snakeCase(key)
    }
    return {key, value}
  })
}

export function resolveResponseData(respData) {
  return hp.mapObjectTree(respData, (value, key, parent) => {
    if (!parent) return
    if (hp.isString(key)) {
      key = hp.camelCase(key)
    }
    if (ut.isISO8601(value)) {
      value = new Date(value)
    }
    return {key, value}
  })
}

export function resolveErrorHttpMessage(data, response, error) {
  return data ? (data.message || validMessage(data.error) || validMessage(data.errorDetails) || validMessage(data.errorCode) || response && response.statusText) : (error ? error.message : 'No details.')
  function validMessage(msg) {
    return msg && hp.isString(msg) && msg
  }
}
