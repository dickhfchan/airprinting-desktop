const Store = require('electron-store');
const store = new Store();
export default {
  storage: store,
  set(name, value, minutes) {
    if (value == null) {
      this.storage.delete(name)
    } else {
      this.storage.set(name, JSON.stringify({
        value,
        expired_at: minutes && new Date().getTime() / 1000 + minutes * 60,
      }))
    }
  },
  get(name) {
    let t = this.storage.get(name)
    if (t) {
      t = JSON.parse(t)
      if (!t.expired_at || t.expired_at > new Date().getTime()) {
        return t.value
      } else {
        this.storage.delete(name)
      }
    }
    return null
  },
  clear() {
    this.storage.clear()
  },
}
