// refer: https://competenepal.com/lets-make-a-facebook-login-system-in-electron-that-actually-works/
import electron from 'electron'
const {remote} = electron
const {BrowserWindow} = remote

export default function (opt = {}) {
  const defaultOpt = {
    // client_id
    scopes: 'public_profile',
    redirect_uri: 'https://www.facebook.com/connect/login_success.html',
    width: 680,
    height: 600,
    api_version: '3.2',
  }
  opt = Object.assign({}, defaultOpt, opt)

  const options = {
    client_id: opt.client_id,
    scopes: opt.scopes,
    redirect_uri: opt.redirect_uri,
  }
  const authWindow = new BrowserWindow({
    width: opt.width,
    height: opt.height,
    show: false,
    parent: remote.getCurrentWindow(),
    modal: true,
    webPreferences: {
      nodeIntegration: false
    }
  });
  const facebookAuthURL = `https://www.facebook.com/v${opt.api_version}/dialog/oauth?client_id=` + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";
  authWindow.loadURL(facebookAuthURL);
  authWindow.show();
  return new Promise((resolve, reject) => {
    authWindow.webContents.on('did-get-redirect-request', async (event, oldUrl, newUrl) => {
      var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
      var access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(newUrl);
      authWindow.close()
      const data = {raw_code, access_token, error}
      if (access_token) {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
}
