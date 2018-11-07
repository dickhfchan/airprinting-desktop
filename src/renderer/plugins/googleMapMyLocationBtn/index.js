import './style.scss'
import * as hp from 'helper-js'

export default function () {
  const myLocationBtn = document.createElement('div')
  hp.addClass(myLocationBtn, 'gmap-my-location-btn')
  myLocationBtn.innerHTML = `<i class="material-icons">my_location</i>`
  return myLocationBtn
}
