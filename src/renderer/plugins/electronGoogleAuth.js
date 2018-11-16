// refrer: https://blog.ecliptic.io/google-auth-in-electron-a47b773940ae
import {parse} from 'url'
import {remote} from 'electron'
import axios from 'axios'
import qs from 'qs'

export default function (opt = {}) {
  const defaultOpt = {
    // client_id
    redirect_uri: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://www.googleapis.com/oauth2/v4/token',
    profile_url: 'https://www.googleapis.com/userinfo/v2/me',
    width: 680,
    height: 600,
  }
  opt = Object.assign({}, defaultOpt, opt)
  return googleSignIn()

  async function googleSignIn () {
    const code = await signInWithPopup()
    return code
    // const tokens = await fetchAccessTokens(code)
    // const {id, email, name} = await fetchGoogleProfile(tokens.access_token)
    // const providerUser = {
    //   uid: id,
    //   email,
    //   displayName: name,
    //   idToken: tokens.id_token,
    // }
    // return providerUser
  }

  function signInWithPopup () {
    return new Promise((resolve, reject) => {
      const authWindow = new remote.BrowserWindow({
        width: opt.width,
        height: opt.height,
        show: true,
      })

      // TODO: Generate and validate PKCE code_challenge value
      const urlParams = {
        response_type: 'code',
        redirect_uri: opt.redirect_uri,
        client_id: opt.client_id,
        scope: 'profile email',
      }
      const authUrl = `${opt.auth_url}?${qs.stringify(urlParams)}`

      authWindow.on('closed', () => {
      })

      authWindow.webContents.on('will-navigate', (event, url) => {
        handleNavigation(url)
      })

      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        handleNavigation(newUrl)
      })

      authWindow.loadURL(authUrl)

      function handleNavigation (url) {
        const query = parse(url, true).query
        if (query) {
          if (query.error) {
            reject(new Error(`There was an error: ${query.error}`))
          } else if (query.code) {
            // Login is complete
            authWindow.removeAllListeners('closed')
            setImmediate(() => authWindow.close())

            // This is the authorization code we need to request tokens
            resolve(query.code)
          }
        }
      }
    })
  }

  async function fetchAccessTokens (code) {
    const response = await axios.post(opt.token_url, qs.stringify({
      code,
      client_id: opt.client_id,
      redirect_uri: opt.redirect_uri,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  }

  async function fetchGoogleProfile (accessToken) {
    const response = await axios.get(opt.profile_url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    return response.data
  }
}
