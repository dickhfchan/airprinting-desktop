export function getCurrentPosition(callback, fallback) {
  // const ts = this
  const {geolocation} = window.navigator
  let count = 0
  let watchId
  if (geolocation) {
    watchId = geolocation.getCurrentPosition((position) => {
      callback(position, count)
      count++
    }, e => {
      console.warn('Failed to get current location by navigator.geolocation. Start to try ip-api.com.', e);
      fallback && fallback(e, count)
      count++
    }, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    })
  } else {
    fallback && fallback(new Error(`The system does not support the geolocation api`))
  }
  return () => {
    // destroy
    if (watchId != null) {
      geolocation.clearWatch(watchId)
    }
  }
  // function byIp(count) {
  //   const ipPositionApiErrorMessageMap = {
  //     'private range':	'Your IP address is part of a private range.',
  //     'reserved range':	'Your IP address is part of a reserved range.',
  //     'invalid query':	'Invalid IP address or domain name.',
  //     'quota':	'Over quota.',
  //   }
  //   ts.$http.get('http://ip-api.com/json').then(({data}) => {
  //     if (data.status !== 'fail') {
  //       const messageText = ipPositionApiErrorMessageMap[data.message]
  //       data.messageText = messageText
  //       errorAlert(messageText)
  //       fallback && fallback(data, count)
  //     } else {
  //       const position = {
  //         coords: {
  //           ...data,
  //           latitude: data.lat,
  //           longitude: data.lon,
  //           altitude: null,
  //           accuracy: null,
  //           altitudeAccuracy : null,
  //           heading : null,
  //           speed : null,
  //         },
  //         timestamp: new Date().getTime(),
  //       }
  //       callback(position, count)
  //     }
  //   }, (e) => {
  //     errorAlert()
  //     fallback && fallback(e, count)
  //   })
  // }
  function errorAlert(msg = '') {
    // ts.$alert(`Failed to get your current location. ${msg}`.trim())
  }
}

export function getCurrentPositionPromise() {
  return new Promise(function(resolve, reject) {
    getCurrentPosition(resolve, reject)
  });
}
