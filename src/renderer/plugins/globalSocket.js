import * as hp from 'helper-js'
import * as ut from '@/plugins/utils'
import store from '../store'

const socket = ut.getSocket(store.state.socket)

// global socket
export default socket

// including a destory function
export function makeSocket() {
  const destroies = []
  const make = (type) => {
    return (name, handler) => {
      socket[type](name, handler)
      const destroy = () => {
        socket.off(name, handler)
        hp.arrayRemove(destroies, destroy)
      }
      destroies.push(destroy)
      return destroy
    }
  }
  const on = make('on')
  const once = make('once')
  const destroyAll = () => {
    destroies.slice().forEach(f => f())
  }
  const emit = (...args) => {
    return socket.emit(...args)
  }
  const socket2 = Object.assign({}, socket, {on, once, emit, destroyListeners: destroyAll, socket})
  return socket2
}
