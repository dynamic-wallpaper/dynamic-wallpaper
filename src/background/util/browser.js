import { BrowserWindow } from 'electron'

export default async function (path = '', options = {}) {
  const baseURL = process.env.WEBPACK_DEV_SERVER_URL || 'app://./index.html/'
  const url = `${baseURL}${path}`

  const { webPreferences = {} } = options
  const win = new BrowserWindow({
    ...options,
    width: 800,
    height: 600,
    webPreferences: {
      ...webPreferences,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  await win.loadURL(url)
  if (!process.env.IS_TEST) win.webContents.openDevTools()
  return win
}
